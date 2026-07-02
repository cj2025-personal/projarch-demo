import type { FlyerContent } from "../content/flyerContent";

export function getFlyerPrintOrigin() {
  const configuredOrigin = process.env.FLYER_PRINT_ORIGIN?.trim();
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, "")}`;
  }

  return "http://localhost:3000";
}

async function renderPdfWithPlaywright(printUrl: string) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(printUrl, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });
    await page.waitForSelector(".flyer-document", { timeout: 60_000 });
    await page.emulateMedia({ media: "print" });

    return Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
    );
  } finally {
    await browser.close();
  }
}

export async function generateFlyerPdf(content: FlyerContent) {
  const encodedContent = Buffer.from(JSON.stringify(content), "utf8").toString("base64url");
  const printUrl = `${getFlyerPrintOrigin()}/flyer/print?data=${encodeURIComponent(encodedContent)}`;
  return renderPdfWithPlaywright(printUrl);
}
