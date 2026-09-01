"use client";

import type { FlyerContent } from "../content/flyerContent";
import {
  createFlyerApi,
  type FlyerVersionResponse as FlyerVersionResponseShape,
  type FlyerVersionSummary,
} from "./flyerApiFactory";

export const flyerSlug = "project-arch";

export type FlyerVersionResponse = FlyerVersionResponseShape<FlyerContent>;
export type { FlyerVersionSummary };

const flyerApi = createFlyerApi<FlyerContent>({
  printPath: "/flyer/print",
  slug: flyerSlug,
});

export function getLatestFlyerPdfUrl() {
  return flyerApi.getLatestPdfUrl();
}

export function fetchLatestFlyerVersion() {
  return flyerApi.fetchLatestVersion();
}

export function publishFlyerContent(content: FlyerContent) {
  return flyerApi.publishContent(content);
}

export function fetchFlyerVersions() {
  return flyerApi.fetchVersions();
}
