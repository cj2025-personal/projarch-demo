"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FlyerContent } from "../content/flyerContent";
import { createDefaultFlyerContent } from "../content/flyerContent";
import { FlyerDocument } from "./FlyerDocument";
import { normalizeFlyerContent, readStoredFlyerContent } from "./useFlyerContent";

function decodeFlyerContent(encodedValue: string): FlyerContent | null {
  try {
    const normalizedValue = encodedValue.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalizedValue);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return normalizeFlyerContent(JSON.parse(json));
  } catch {
    return null;
  }
}

export function FlyerPrintPageClient() {
  const searchParams = useSearchParams();
  const encodedContent = searchParams.get("data");
  const source = searchParams.get("source");
  const shouldPrint = searchParams.get("print") === "1";
  const initialContent = encodedContent ? decodeFlyerContent(encodedContent) : null;
  const [content, setContent] = useState<FlyerContent>(
    () => initialContent ?? createDefaultFlyerContent(),
  );
  const [isReady, setIsReady] = useState(source !== "editor" || initialContent !== null);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      setIsReady(true);
      return;
    }

    if (source !== "editor") {
      setContent(createDefaultFlyerContent());
      setIsReady(true);
      return;
    }

    const storedContent = readStoredFlyerContent();
    setContent(storedContent ?? createDefaultFlyerContent());
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
      <FlyerDocument content={content} mode="export" />
    </main>
  );
}
