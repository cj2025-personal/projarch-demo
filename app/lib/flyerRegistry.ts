import type { FlyerContent } from "../content/flyerContent";
import type { ScholarDataContent } from "../content/scholarDataContent";
import { normalizeFlyerContent } from "./flyerNormalize";
import { normalizeScholarDataContent } from "./scholarDataNormalize";

export type AnyFlyerContent = FlyerContent | ScholarDataContent;

export const projectArchFlyerSlug = "project-arch";
export const scholarDataFlyerSlug = "scholar-data";

type FlyerDefinition = {
  normalize: (value: unknown) => AnyFlyerContent;
  printPath: string;
};

const flyerDefinitions: Record<string, FlyerDefinition> = {
  [projectArchFlyerSlug]: {
    normalize: normalizeFlyerContent,
    printPath: "/flyer/print",
  },
  [scholarDataFlyerSlug]: {
    normalize: normalizeScholarDataContent,
    printPath: "/scholar-data/print",
  },
};

export function isKnownFlyerSlug(slug: string) {
  return Object.hasOwn(flyerDefinitions, slug);
}

export function getFlyerDefinition(slug: string): FlyerDefinition {
  const definition = flyerDefinitions[slug];

  if (!definition) {
    throw new Error(`Unknown flyer slug: ${slug}`);
  }

  return definition;
}
