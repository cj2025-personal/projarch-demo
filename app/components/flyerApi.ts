"use client";

import type { FlyerContent } from "../content/flyerContent";
import {
  flyerPdfBytesToBase64,
  generateFlyerPdfClient,
} from "./generateFlyerPdfClient";

export const flyerSlug = "project-arch";

export type FlyerVersionResponse = {
  content: FlyerContent;
  createdAt: string;
  latestPdfUrl: string;
  slug: string;
  updatedAt: string;
  version: number;
  versionPdfUrl: string;
};

export type FlyerVersionSummary = Omit<FlyerVersionResponse, "content">;

function getLatestFlyerMetadataUrl() {
  return `/api/flyers/${flyerSlug}`;
}

function getPublishFlyerUrl() {
  return `/api/flyers/${flyerSlug}/versions`;
}

function getFlyerVersionsUrl() {
  return `/api/flyers/${flyerSlug}/versions`;
}

export function getLatestFlyerPdfUrl() {
  return `/api/flyers/${flyerSlug}/latest.pdf`;
}

export async function fetchLatestFlyerVersion() {
  const response = await fetch(getLatestFlyerMetadataUrl(), {
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

  return (await response.json()) as FlyerVersionResponse;
}

export async function publishFlyerContent(content: FlyerContent) {
  const pdfBytes = await generateFlyerPdfClient(content);
  const pdfBase64 = flyerPdfBytesToBase64(pdfBytes);

  const response = await fetch(getPublishFlyerUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      content,
      pdfBase64,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Unable to publish flyer changes (${response.status}).`;

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Keep the generic error message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as FlyerVersionResponse;
}

export async function fetchFlyerVersions() {
  const response = await fetch(getFlyerVersionsUrl(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = `Unable to load flyer versions (${response.status}).`;

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Keep the generic error message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as FlyerVersionSummary[];
}
