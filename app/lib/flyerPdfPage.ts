import type { FlyerDocument } from "./flyerDb";

export type FlyerPdfSelection =
  | { ok: true; pdf: FlyerDocument["pdf"]; filenameSuffix: string }
  | { ok: false; error: string };

/**
 * Picks the combined PDF, or a single page when `?page=N` is supplied.
 * Versions published before per-page PDFs existed carry no pages, so the
 * caller is told to republish rather than handed the wrong file.
 */
export function selectFlyerPdf(
  document: FlyerDocument,
  pageParam: string | null,
): FlyerPdfSelection {
  if (pageParam === null) {
    return { ok: true, pdf: document.pdf, filenameSuffix: "" };
  }

  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 1) {
    return { ok: false, error: "The page parameter must be a positive whole number." };
  }

  const pages = document.pages ?? [];
  if (pages.length === 0) {
    return {
      ok: false,
      error:
        "This version was published before single-page downloads were available. Publish again from the editor to generate them.",
    };
  }

  const selected = pages[page - 1];
  if (!selected) {
    return {
      ok: false,
      error: `This flyer has ${pages.length} pages; page ${page} does not exist.`,
    };
  }

  return { ok: true, pdf: selected, filenameSuffix: `-page${page}` };
}
