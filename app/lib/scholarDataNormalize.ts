import type {
  ScholarDataContent,
  ScholarDataPair,
  ScholarDataStage,
  ScholarDataStageIcon,
  ScholarDataTier,
  ScholarGroup,
  ScholarGroupIcon,
} from "../content/scholarDataContent";
import { createDefaultScholarDataContent } from "../content/scholarDataContent";

const stageIcons: ScholarDataStageIcon[] = [
  "source",
  "profile",
  "section",
  "passage",
  "evidence",
  "answer",
];

function trimString(value: string, fallback: string) {
  return value.trim().length > 0 ? value.trim() : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function requiredText(value: unknown, fallback: string) {
  return typeof value === "string" ? trimString(value, fallback) : fallback;
}

function pairArray(value: unknown, fallback: ScholarDataPair[]): ScholarDataPair[] {
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
    label: trimString(item.label as string, ""),
    detail: trimString(item.detail as string, ""),
  }));
}

function stageArray(value: unknown, fallback: ScholarDataStage[]): ScholarDataStage[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.step === "string" &&
        typeof item.title === "string" &&
        typeof item.detail === "string" &&
        typeof item.icon === "string" &&
        stageIcons.includes(item.icon as ScholarDataStageIcon),
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    step: trimString(item.step as string, ""),
    title: trimString(item.title as string, ""),
    detail: trimString(item.detail as string, ""),
    icon: item.icon as ScholarDataStageIcon,
  }));
}

const groupIcons: ScholarGroupIcon[] = ["contemporary", "legacy", "legendary"];

function groupArray(value: unknown, fallback: ScholarGroup[]): ScholarGroup[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === "string" &&
        typeof item.dashboardLabel === "string" &&
        typeof item.detail === "string" &&
        typeof item.criteriaLabel === "string" &&
        typeof item.criteria === "string" &&
        typeof item.icon === "string" &&
        groupIcons.includes(item.icon as ScholarGroupIcon),
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    name: trimString(item.name as string, ""),
    dashboardLabel: trimString(item.dashboardLabel as string, ""),
    detail: trimString(item.detail as string, ""),
    criteriaLabel: trimString(item.criteriaLabel as string, ""),
    criteria: trimString(item.criteria as string, ""),
    icon: item.icon as ScholarGroupIcon,
  }));
}

function tierArray(value: unknown, fallback: ScholarDataTier[]): ScholarDataTier[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.tier === "string" &&
        typeof item.title === "string" &&
        typeof item.detail === "string",
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    tier: trimString(item.tier as string, ""),
    title: trimString(item.title as string, ""),
    detail: trimString(item.detail as string, ""),
  }));
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return fallback;
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

export function normalizeScholarDataContent(value: unknown): ScholarDataContent {
  const fallback = createDefaultScholarDataContent();
  const input = isRecord(value) ? value : {};

  return {
    frontEyebrow: text(input.frontEyebrow, fallback.frontEyebrow),
    backEyebrow: text(input.backEyebrow, fallback.backEyebrow),
    companyName: requiredText(input.companyName, fallback.companyName),
    companyTagline: requiredText(input.companyTagline, fallback.companyTagline),
    conceptOneLiner: text(input.conceptOneLiner, fallback.conceptOneLiner),
    companyMission: text(input.companyMission, fallback.companyMission),
    heroCardTitle: text(input.heroCardTitle, fallback.heroCardTitle),
    dataPillars: pairArray(input.dataPillars, fallback.dataPillars),
    scopeHeading: text(input.scopeHeading, fallback.scopeHeading),
    scopeNote: text(input.scopeNote, fallback.scopeNote),
    pipelineHeading: text(input.pipelineHeading, fallback.pipelineHeading),
    pipelineIntro: text(input.pipelineIntro, fallback.pipelineIntro),
    pipelineStages: stageArray(input.pipelineStages, fallback.pipelineStages),
    assuranceHeading: text(input.assuranceHeading, fallback.assuranceHeading),
    assuranceNote: text(input.assuranceNote, fallback.assuranceNote),
    audienceSummary: pairArray(input.audienceSummary, fallback.audienceSummary),
    groupsHeading: text(input.groupsHeading, fallback.groupsHeading),
    groupsIntro: text(input.groupsIntro, fallback.groupsIntro),
    scholarGroups: groupArray(input.scholarGroups, fallback.scholarGroups),
    hierarchyHeading: text(input.hierarchyHeading, fallback.hierarchyHeading),
    hierarchyIntro: text(input.hierarchyIntro, fallback.hierarchyIntro),
    hierarchyTiers: tierArray(input.hierarchyTiers, fallback.hierarchyTiers),
    classificationHeading: text(input.classificationHeading, fallback.classificationHeading),
    classificationNote: text(input.classificationNote, fallback.classificationNote),
    safeguardsHeading: text(input.safeguardsHeading, fallback.safeguardsHeading),
    safeguards: stringArray(input.safeguards, fallback.safeguards),
    ideatorLabel: text(input.ideatorLabel, fallback.ideatorLabel),
    ideator: text(input.ideator, fallback.ideator),
    contactLine: text(input.contactLine, fallback.contactLine),
    contactEmail: text(input.contactEmail, fallback.contactEmail),
    footerNote: text(input.footerNote, fallback.footerNote),
  };
}
