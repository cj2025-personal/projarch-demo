"use client";

import {
  flyerPdfBytesToBase64,
  generateFlyerPdfSet,
} from "./generateFlyerPdfClient";

export type FlyerVersionResponse<TContent> = {
  content: TContent;
  createdAt: string;
  latestPdfUrl: string;
  pageCount: number;
  pagePdfUrls: string[];
  slug: string;
  updatedAt: string;
  version: number;
  versionPdfUrl: string;
};

export type FlyerVersionSummary = Omit<FlyerVersionResponse<never>, "content">;

type FlyerApiConfig = {
  printPath: string;
  slug: string;
};

async function readErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const payload = (await response.json()) as { error?: string };
    if (payload.error) {
      return payload.error;
    }
  } catch {
    // Keep the generic error message.
  }

  return fallbackMessage;
}

export function createFlyerApi<TContent>({ printPath, slug }: FlyerApiConfig) {
  const latestMetadataUrl = `/api/flyers/${slug}`;
  const versionsUrl = `/api/flyers/${slug}/versions`;
  const latestPdfUrl = `/api/flyers/${slug}/latest.pdf`;

  const fetchLatestVersion = async () => {
    const response = await fetch(latestMetadataUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Unable to load the latest flyer version (${response.status}).`);
    }

    return (await response.json()) as FlyerVersionResponse<TContent>;
  };

  const publishContent = async (content: TContent) => {
    const { combined, pages } = await generateFlyerPdfSet(content, printPath);
    const pdfBase64 = flyerPdfBytesToBase64(combined);
    const pagePdfsBase64 = pages.map(flyerPdfBytesToBase64);

    const response = await fetch(versionsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        content,
        pdfBase64,
        pagePdfsBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(
        await readErrorMessage(
          response,
          `Unable to publish flyer changes (${response.status}).`,
        ),
      );
    }

    return (await response.json()) as FlyerVersionResponse<TContent>;
  };

  const fetchVersions = async () => {
    const response = await fetch(versionsUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        await readErrorMessage(response, `Unable to load flyer versions (${response.status}).`),
      );
    }

    return (await response.json()) as FlyerVersionSummary[];
  };

  return {
    fetchLatestVersion,
    fetchVersions,
    getLatestPdfUrl: (page?: number) =>
      page ? `${latestPdfUrl}?page=${page}` : latestPdfUrl,
    publishContent,
    slug,
  };
}
