import type { FlyerContent, FlyerFeatureRow, FlyerPair } from "../content/flyerContent";
import { createDefaultFlyerContent } from "../content/flyerContent";

function trimString(value: string, fallback: string) {
  return value.trim().length > 0 ? value.trim() : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pairArray(value: unknown, fallback: FlyerPair[]): FlyerPair[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) && typeof item.label === "string" && typeof item.detail === "string",
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    label: trimString(item.label, ""),
    detail: trimString(item.detail, ""),
  }));
}

function featureRowArray(value: unknown, fallback: FlyerFeatureRow[]): FlyerFeatureRow[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.detail === "string" &&
        (item.icon === "chat" ||
          item.icon === "directory" ||
          item.icon === "podcast" ||
          item.icon === "editorial"),
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    title: trimString(item.title, ""),
    detail: trimString(item.detail, ""),
    icon: item.icon as FlyerFeatureRow["icon"],
  }));
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return fallback;
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

export function normalizeFlyerContent(value: unknown): FlyerContent {
  const fallback = createDefaultFlyerContent();
  const input = isRecord(value) ? value : {};

  return {
    frontEyebrow:
      typeof input.frontEyebrow === "string" ? input.frontEyebrow : fallback.frontEyebrow,
    backEyebrow: typeof input.backEyebrow === "string" ? input.backEyebrow : fallback.backEyebrow,
    heroCardTitle:
      typeof input.heroCardTitle === "string" ? input.heroCardTitle : fallback.heroCardTitle,
    companyName:
      typeof input.companyName === "string"
        ? trimString(input.companyName, fallback.companyName)
        : fallback.companyName,
    companyTagline:
      typeof input.companyTagline === "string"
        ? trimString(input.companyTagline, fallback.companyTagline)
        : fallback.companyTagline,
    conceptOneLiner:
      typeof input.conceptOneLiner === "string"
        ? input.conceptOneLiner
        : fallback.conceptOneLiner,
    companyMission:
      typeof input.companyMission === "string" ? input.companyMission : fallback.companyMission,
    scopeHeading:
      typeof input.scopeHeading === "string" ? input.scopeHeading : fallback.scopeHeading,
    scopeNote: typeof input.scopeNote === "string" ? input.scopeNote : fallback.scopeNote,
    frontFeatureRows: featureRowArray(input.frontFeatureRows, fallback.frontFeatureRows),
    summaryHeading:
      typeof input.summaryHeading === "string" ? input.summaryHeading : fallback.summaryHeading,
    valuePillars: pairArray(input.valuePillars, fallback.valuePillars),
    featurePersonalization:
      typeof input.featurePersonalization === "string"
        ? input.featurePersonalization
        : fallback.featurePersonalization,
    featureGoal:
      typeof input.featureGoal === "string" ? input.featureGoal : fallback.featureGoal,
    valueSummary: pairArray(input.valueSummary, fallback.valueSummary),
    featuresHeading:
      typeof input.featuresHeading === "string" ? input.featuresHeading : fallback.featuresHeading,
    featuresIntro:
      typeof input.featuresIntro === "string" ? input.featuresIntro : fallback.featuresIntro,
    platformFeatures: stringArray(input.platformFeatures, fallback.platformFeatures),
    collaborationHeading:
      typeof input.collaborationHeading === "string"
        ? input.collaborationHeading
        : fallback.collaborationHeading,
    collaborationBody:
      typeof input.collaborationBody === "string"
        ? input.collaborationBody
        : fallback.collaborationBody,
    backNoteHeading:
      typeof input.backNoteHeading === "string" ? input.backNoteHeading : fallback.backNoteHeading,
    ideatorLabel:
      typeof input.ideatorLabel === "string" ? input.ideatorLabel : fallback.ideatorLabel,
    ideator: typeof input.ideator === "string" ? input.ideator : fallback.ideator,
    contactLine: typeof input.contactLine === "string" ? input.contactLine : fallback.contactLine,
    contactEmail:
      typeof input.contactEmail === "string" ? input.contactEmail : fallback.contactEmail,
    qrTitle: typeof input.qrTitle === "string" ? input.qrTitle : fallback.qrTitle,
    qrSubtitle: typeof input.qrSubtitle === "string" ? input.qrSubtitle : fallback.qrSubtitle,
    footerNote: typeof input.footerNote === "string" ? input.footerNote : fallback.footerNote,
  };
}
