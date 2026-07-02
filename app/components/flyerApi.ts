"use client";

import type { FlyerContent } from "../content/flyerContent";

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

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getFlyerApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_FLYER_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  if (typeof window === "undefined") {
    return "";
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8003";
  }

  return trimTrailingSlash(window.location.origin);
}

export function getLatestFlyerPdfUrl() {
  return `${getFlyerApiBaseUrl()}/api/flyers/${flyerSlug}/latest.pdf`;
}

function getLatestFlyerMetadataUrl() {
  return `${getFlyerApiBaseUrl()}/api/flyers/${flyerSlug}`;
}

function getPublishFlyerUrl() {
  return `/api/flyers/${flyerSlug}/versions`;
}

function getFlyerVersionsUrl() {
  return `/api/flyers/${flyerSlug}/versions`;
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
  const response = await fetch(getPublishFlyerUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ content }),
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
