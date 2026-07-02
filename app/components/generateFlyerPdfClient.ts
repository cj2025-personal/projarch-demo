"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { FlyerContent } from "../content/flyerContent";

function encodeFlyerContentParam(content: FlyerContent) {
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

export async function generateFlyerPdfClient(content: FlyerContent) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  try {
    const printUrl = `/flyer/print?data=${encodeURIComponent(encodeFlyerContentParam(content))}`;

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

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let index = 0; index < sheets.length; index += 1) {
      const canvas = await html2canvas(sheets[index], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      const renderHeight = (canvas.height * pageWidth) / canvas.width;

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(imageData, "JPEG", 0, 0, pageWidth, Math.min(renderHeight, pageHeight));
    }

    return new Uint8Array(pdf.output("arraybuffer"));
  } finally {
    iframe.remove();
  }
}
