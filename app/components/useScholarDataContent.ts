"use client";

import { useEffect, useState } from "react";
import { fetchLatestScholarDataVersion } from "./scholarDataApi";
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

export const scholarDataStorageKey = "project-arch.scholar-data-content.v1";

const stageIcons: ScholarDataStageIcon[] = [
  "source",
  "profile",
  "section",
  "passage",
  "evidence",
  "answer",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function toNonEmptyString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().length > 0 ? value : fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return fallback;
  }

  return value.slice();
}

function toPairArray(value: unknown, fallback: ScholarDataPair[]): ScholarDataPair[] {
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
    label: item.label as string,
    detail: item.detail as string,
  }));
}

function toStageArray(value: unknown, fallback: ScholarDataStage[]): ScholarDataStage[] {
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
    step: item.step as string,
    title: item.title as string,
    detail: item.detail as string,
    icon: item.icon as ScholarDataStageIcon,
  }));
}

const groupIcons: ScholarGroupIcon[] = ["contemporary", "legacy", "legendary"];

function toGroupArray(value: unknown, fallback: ScholarGroup[]): ScholarGroup[] {
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
    name: item.name as string,
    dashboardLabel: item.dashboardLabel as string,
    detail: item.detail as string,
    criteriaLabel: item.criteriaLabel as string,
    criteria: item.criteria as string,
    icon: item.icon as ScholarGroupIcon,
  }));
}

function toTierArray(value: unknown, fallback: ScholarDataTier[]): ScholarDataTier[] {
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
    tier: item.tier as string,
    title: item.title as string,
    detail: item.detail as string,
  }));
}

export function normalizeScholarDataContent(value: unknown): ScholarDataContent | null {
  if (!isRecord(value)) {
    return null;
  }

  const fallback = createDefaultScholarDataContent();

  return {
    frontEyebrow: toString(value.frontEyebrow, fallback.frontEyebrow),
    backEyebrow: toString(value.backEyebrow, fallback.backEyebrow),
    companyName: toNonEmptyString(value.companyName, fallback.companyName),
    companyTagline: toNonEmptyString(value.companyTagline, fallback.companyTagline),
    conceptOneLiner: toString(value.conceptOneLiner, fallback.conceptOneLiner),
    companyMission: toString(value.companyMission, fallback.companyMission),
    heroCardTitle: toString(value.heroCardTitle, fallback.heroCardTitle),
    dataPillars: toPairArray(value.dataPillars, fallback.dataPillars),
    scopeHeading: toString(value.scopeHeading, fallback.scopeHeading),
    scopeNote: toString(value.scopeNote, fallback.scopeNote),
    pipelineHeading: toString(value.pipelineHeading, fallback.pipelineHeading),
    pipelineIntro: toString(value.pipelineIntro, fallback.pipelineIntro),
    pipelineStages: toStageArray(value.pipelineStages, fallback.pipelineStages),
    assuranceHeading: toString(value.assuranceHeading, fallback.assuranceHeading),
    assuranceNote: toString(value.assuranceNote, fallback.assuranceNote),
    audienceSummary: toPairArray(value.audienceSummary, fallback.audienceSummary),
    groupsHeading: toString(value.groupsHeading, fallback.groupsHeading),
    groupsIntro: toString(value.groupsIntro, fallback.groupsIntro),
    scholarGroups: toGroupArray(value.scholarGroups, fallback.scholarGroups),
    hierarchyHeading: toString(value.hierarchyHeading, fallback.hierarchyHeading),
    hierarchyIntro: toString(value.hierarchyIntro, fallback.hierarchyIntro),
    hierarchyTiers: toTierArray(value.hierarchyTiers, fallback.hierarchyTiers),
    classificationHeading: toString(value.classificationHeading, fallback.classificationHeading),
    classificationNote: toString(value.classificationNote, fallback.classificationNote),
    safeguardsHeading: toString(value.safeguardsHeading, fallback.safeguardsHeading),
    safeguards: toStringArray(value.safeguards, fallback.safeguards),
    ideatorLabel: toString(value.ideatorLabel, fallback.ideatorLabel),
    ideator: toString(value.ideator, fallback.ideator),
    contactLine: toString(value.contactLine, fallback.contactLine),
    contactEmail: toString(value.contactEmail, fallback.contactEmail),
    footerNote: toString(value.footerNote, fallback.footerNote),
  };
}

export function readStoredScholarDataContent(): ScholarDataContent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(scholarDataStorageKey);
  if (!raw) {
    return null;
  }

  try {
    return normalizeScholarDataContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredScholarDataContent(content: ScholarDataContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(scholarDataStorageKey, JSON.stringify(content));
}

export function useScholarDataContent(options?: { persist?: boolean }) {
  const persist = options?.persist ?? false;
  const [content, setContent] = useState<ScholarDataContent>(() =>
    createDefaultScholarDataContent(),
  );
  const [isReady, setIsReady] = useState(false);
  const [latestVersion, setLatestVersion] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialContent = async () => {
      const storedContent = readStoredScholarDataContent();
      if (storedContent) {
        setContent(storedContent);
      }

      try {
        const latestFlyerVersion = await fetchLatestScholarDataVersion();
        if (!latestFlyerVersion || cancelled) {
          return;
        }

        const normalizedContent =
          normalizeScholarDataContent(latestFlyerVersion.content) ??
          createDefaultScholarDataContent();

        setContent(normalizedContent);
        setLatestVersion(latestFlyerVersion.version);
        setSyncError(null);

        if (persist) {
          writeStoredScholarDataContent(normalizedContent);
        }
      } catch (error) {
        if (!cancelled) {
          setSyncError(
            error instanceof Error ? error.message : "Unable to sync flyer content.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };

    void loadInitialContent();

    return () => {
      cancelled = true;
    };
  }, [persist]);

  useEffect(() => {
    if (!isReady || !persist) {
      return;
    }

    writeStoredScholarDataContent(content);
  }, [content, isReady, persist]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== scholarDataStorageKey) {
        return;
      }

      const storedContent = readStoredScholarDataContent();
      setContent(storedContent ?? createDefaultScholarDataContent());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isReady]);

  return {
    content,
    isReady,
    latestVersion,
    setContent,
    setLatestVersion,
    syncError,
  };
}
