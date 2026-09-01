"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ScholarDataContent } from "../content/scholarDataContent";
import { createDefaultScholarDataContent } from "../content/scholarDataContent";
import { ScholarDataDocument } from "./ScholarDataDocument";
import {
  normalizeScholarDataContent,
  readStoredScholarDataContent,
} from "./useScholarDataContent";

function decodeScholarDataContent(encodedValue: string): ScholarDataContent | null {
  try {
    const normalizedValue = encodedValue.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalizedValue);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return normalizeScholarDataContent(JSON.parse(json));
  } catch {
    return null;
  }
}

export function ScholarDataPrintPageClient() {
  const searchParams = useSearchParams();
  const encodedContent = searchParams.get("data");
  const source = searchParams.get("source");
  const shouldPrint = searchParams.get("print") === "1";
  const initialContent = encodedContent ? decodeScholarDataContent(encodedContent) : null;
  const [content, setContent] = useState<ScholarDataContent>(
    () => initialContent ?? createDefaultScholarDataContent(),
  );
  const [isReady, setIsReady] = useState(source !== "editor" || initialContent !== null);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      setIsReady(true);
      return;
    }

    if (source !== "editor") {
      setContent(createDefaultScholarDataContent());
      setIsReady(true);
      return;
    }

    const storedContent = readStoredScholarDataContent();
    setContent(storedContent ?? createDefaultScholarDataContent());
    setIsReady(true);
  }, [initialContent, source]);

  useEffect(() => {
    if (!shouldPrint || !isReady) {
      return;
    }

    let cancelled = false;

    const printDocument = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // Continue even if font readiness is unavailable.
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) {
            window.print();
          }
        });
      });
    };

    void printDocument();

    return () => {
      cancelled = true;
    };
  }, [content, isReady, shouldPrint]);

  if (!isReady) {
    return null;
  }

  return (
    <main className="flyer-page flyer-page-print">
      <ScholarDataDocument content={content} mode="export" />
    </main>
  );
}
