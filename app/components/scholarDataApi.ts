"use client";

import type { ScholarDataContent } from "../content/scholarDataContent";
import {
  createFlyerApi,
  type FlyerVersionResponse as FlyerVersionResponseShape,
  type FlyerVersionSummary,
} from "./flyerApiFactory";

export const scholarDataSlug = "scholar-data";
export const scholarDataPrintPath = "/scholar-data/print";

export type ScholarDataVersionResponse = FlyerVersionResponseShape<ScholarDataContent>;
export type { FlyerVersionSummary as ScholarDataVersionSummary };

const scholarDataApi = createFlyerApi<ScholarDataContent>({
  printPath: scholarDataPrintPath,
  slug: scholarDataSlug,
});

export function getLatestScholarDataPdfUrl(page?: number) {
  return scholarDataApi.getLatestPdfUrl(page);
}

export function fetchLatestScholarDataVersion() {
  return scholarDataApi.fetchLatestVersion();
}

export function publishScholarDataContent(content: ScholarDataContent) {
  return scholarDataApi.publishContent(content);
}

export function fetchScholarDataVersions() {
  return scholarDataApi.fetchVersions();
}
