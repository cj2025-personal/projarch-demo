"use client";

import { useEffect, useState } from "react";
import {
  fetchLatestScholarDataVersion,
  getLatestScholarDataPdfUrl,
} from "./scholarDataApi";

const pageLabels = ["Page 1 - The pipeline", "Page 2 - The hierarchy"];

export function ScholarDataDownloadButtons() {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadPageCount = async () => {
      try {
        const latest = await fetchLatestScholarDataVersion();
        if (!cancelled && latest) {
          setPageCount(latest.pageCount ?? 0);
        }
      } catch {
        // The combined download stays available even if the count is unknown.
      }
    };

    void loadPageCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <a className="button button-primary flyer-download" href={getLatestScholarDataPdfUrl()}>
        Download Both Pages
      </a>
      {Array.from({ length: pageCount }, (_item, index) => (
        <a
          className="button button-secondary flyer-download-secondary"
          href={getLatestScholarDataPdfUrl(index + 1)}
          key={`page-${index + 1}`}
        >
          {pageLabels[index] ?? `Page ${index + 1}`}
        </a>
      ))}
    </>
  );
}
