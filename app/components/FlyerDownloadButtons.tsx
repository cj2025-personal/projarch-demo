"use client";

import { useEffect, useState } from "react";
import { getLatestFlyerPdfUrl } from "./flyerApi";

type FlyerDownloadButtonsProps = {
  includeFlyerPageLink?: boolean;
};

export function FlyerDownloadButtons({
  includeFlyerPageLink = true,
}: FlyerDownloadButtonsProps) {
  const [downloadUrl, setDownloadUrl] = useState("/api/flyers/project-arch/latest.pdf");

  useEffect(() => {
    setDownloadUrl(getLatestFlyerPdfUrl());
  }, []);

  return (
    <>
      <a className="button button-primary flyer-download" href={downloadUrl}>
        Download Flyer PDF
      </a>
      {includeFlyerPageLink ? (
        <a className="button button-secondary flyer-download-secondary" href="/flyer">
          Flyer Download Page
        </a>
      ) : null}
    </>
  );
}
