"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export type FlyerPdfSet = {
  combined: Uint8Array;
  pages: Uint8Array[];
};

function encodeFlyerContentParam(content: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(content));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function flyerPdfBytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

/** Hands a generated PDF straight to the browser as a file download. */
export function triggerFlyerPdfDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

function createFlyerPdf() {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
}

function placeSheet(pdf: jsPDF, imageData: string, aspectRatio: number) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const renderHeight = pageWidth * aspectRatio;

  pdf.addImage(imageData, "JPEG", 0, 0, pageWidth, Math.min(renderHeight, pageHeight));
}

/**
 * Renders the print route in a hidden iframe and captures every `.flyer-sheet`.
 * Each sheet is rasterised once and reused for both the combined document and
 * its own single-page document, so splitting costs no extra render work.
 */
export async function generateFlyerPdfSet(
  content: unknown,
  printPath = "/flyer/print",
): Promise<FlyerPdfSet> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  try {
    const printUrl = `${printPath}?data=${encodeURIComponent(encodeFlyerContentParam(content))}`;

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error("Print preview timed out while generating the PDF.")),
        45_000,
      );

      iframe.onload = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      iframe.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Unable to load the print preview."));
      };
      iframe.src = printUrl;
    });

    const frameDocument = iframe.contentDocument;
    if (!frameDocument) {
      throw new Error("Print preview is unavailable.");
    }

    try {
      await frameDocument.fonts.ready;
    } catch {
      // Continue without font readiness.
    }

    await new Promise((resolve) => window.setTimeout(resolve, 750));

    const sheets = Array.from(frameDocument.querySelectorAll<HTMLElement>(".flyer-sheet"));
    if (sheets.length === 0) {
      throw new Error("Flyer pages were not rendered.");
    }

    const combined = createFlyerPdf();
    const pages: Uint8Array[] = [];

    for (let index = 0; index < sheets.length; index += 1) {
      const canvas = await html2canvas(sheets[index], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      const aspectRatio = canvas.height / canvas.width;

      if (index > 0) {
        combined.addPage();
      }
      placeSheet(combined, imageData, aspectRatio);

      const single = createFlyerPdf();
      placeSheet(single, imageData, aspectRatio);
      pages.push(new Uint8Array(single.output("arraybuffer")));
    }

    return {
      combined: new Uint8Array(combined.output("arraybuffer")),
      pages,
    };
  } finally {
    iframe.remove();
  }
}

export async function generateFlyerPdfClient(content: unknown, printPath = "/flyer/print") {
  const { combined } = await generateFlyerPdfSet(content, printPath);
  return combined;
}
