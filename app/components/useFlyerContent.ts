"use client";

import { useEffect, useState } from "react";
import { fetchLatestFlyerVersion } from "./flyerApi";
import type { FlyerContent, FlyerFeatureRow, FlyerPair } from "../content/flyerContent";
import { createDefaultFlyerContent } from "../content/flyerContent";

export const flyerStorageKey = "project-arch.flyer-content.v1";

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

function toPairArray(value: unknown, fallback: FlyerPair[]): FlyerPair[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) && typeof item.label === "string" && typeof item.detail === "string",
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({ label: item.label, detail: item.detail }));
}

function toFeatureRowArray(
  value: unknown,
  fallback: FlyerFeatureRow[],
): FlyerFeatureRow[] {
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
    title: item.title,
    detail: item.detail,
    icon: item.icon,
  }));
}

export function normalizeFlyerContent(value: unknown): FlyerContent | null {
  if (!isRecord(value)) {
    return null;
  }

  const fallback = createDefaultFlyerContent();

  return {
    frontEyebrow: toString(value.frontEyebrow, fallback.frontEyebrow),
    backEyebrow: toString(value.backEyebrow, fallback.backEyebrow),
    heroCardTitle: toString(value.heroCardTitle, fallback.heroCardTitle),
    companyName: toNonEmptyString(value.companyName, fallback.companyName),
    companyTagline: toNonEmptyString(value.companyTagline, fallback.companyTagline),
    conceptOneLiner: toString(value.conceptOneLiner, fallback.conceptOneLiner),
    companyMission: toString(value.companyMission, fallback.companyMission),
    scopeHeading: toString(value.scopeHeading, fallback.scopeHeading),
    scopeNote: toString(value.scopeNote, fallback.scopeNote),
    frontFeatureRows: toFeatureRowArray(value.frontFeatureRows, fallback.frontFeatureRows),
    summaryHeading: toString(value.summaryHeading, fallback.summaryHeading),
    valuePillars: toPairArray(value.valuePillars, fallback.valuePillars),
    featurePersonalization: toString(
      value.featurePersonalization,
      fallback.featurePersonalization,
    ),
    featureGoal: toString(value.featureGoal, fallback.featureGoal),
    valueSummary: toPairArray(value.valueSummary, fallback.valueSummary),
    featuresHeading: toString(value.featuresHeading, fallback.featuresHeading),
    featuresIntro: toString(value.featuresIntro, fallback.featuresIntro),
    platformFeatures: toStringArray(value.platformFeatures, fallback.platformFeatures),
    collaborationHeading: toString(
      value.collaborationHeading,
      fallback.collaborationHeading,
    ),
    collaborationBody: toString(value.collaborationBody, fallback.collaborationBody),
    backNoteHeading: toString(value.backNoteHeading, fallback.backNoteHeading),
    ideatorLabel: toString(value.ideatorLabel, fallback.ideatorLabel),
    ideator: toString(value.ideator, fallback.ideator),
    contactLine: toString(value.contactLine, fallback.contactLine),
    contactEmail: toString(value.contactEmail, fallback.contactEmail),
    qrTitle: toString(value.qrTitle, fallback.qrTitle),
    qrSubtitle: toString(value.qrSubtitle, fallback.qrSubtitle),
    footerNote: toString(value.footerNote, fallback.footerNote),
  };
}

export function readStoredFlyerContent(): FlyerContent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(flyerStorageKey);
  if (!raw) {
    return null;
  }

  try {
    return normalizeFlyerContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredFlyerContent(content: FlyerContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(flyerStorageKey, JSON.stringify(content));
}

export function useFlyerContent(options?: { persist?: boolean }) {
  const persist = options?.persist ?? false;
  const [content, setContent] = useState<FlyerContent>(() => createDefaultFlyerContent());
  const [isReady, setIsReady] = useState(false);
  const [latestVersion, setLatestVersion] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialContent = async () => {
      const storedContent = readStoredFlyerContent();
      if (storedContent) {
        setContent(storedContent);
      }

      try {
        const latestFlyerVersion = await fetchLatestFlyerVersion();
        if (!latestFlyerVersion || cancelled) {
          return;
        }

        const normalizedContent =
          normalizeFlyerContent(latestFlyerVersion.content) ?? createDefaultFlyerContent();

        setContent(normalizedContent);
        setLatestVersion(latestFlyerVersion.version);
        setSyncError(null);

        if (persist) {
          writeStoredFlyerContent(normalizedContent);
        }
      } catch (error) {
        if (!cancelled) {
          setSyncError(error instanceof Error ? error.message : "Unable to sync flyer content.");
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

    writeStoredFlyerContent(content);
  }, [content, isReady, persist]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== flyerStorageKey) {
        return;
      }

      const storedContent = readStoredFlyerContent();
      setContent(storedContent ?? createDefaultFlyerContent());
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
