"use client";

type FlyerDownloadButtonsProps = {
  includeFlyerPageLink?: boolean;
};

export function FlyerDownloadButtons({
  includeFlyerPageLink = true,
}: FlyerDownloadButtonsProps) {
  const downloadUrl = "/api/flyers/project-arch/latest.pdf";

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
