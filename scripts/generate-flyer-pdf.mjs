import { createServer } from "node:http";
import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import handler from "serve-handler";

const port = 3456;
const siteRoot = path.resolve("out");
const pdfPath = path.resolve("public/project-arch-flyer.pdf");
const outPdfPath = path.resolve("out/project-arch-flyer.pdf");
const baseUrl = `http://127.0.0.1:${port}`;

async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyExistingPdf() {
  if (!(await fileExists(pdfPath))) {
    return false;
  }

  await mkdir(path.dirname(outPdfPath), { recursive: true });
  await copyFile(pdfPath, outPdfPath);
  return true;
}

async function renderPdf() {
  const server = createServer((request, response) =>
    handler(request, response, { public: siteRoot }),
  );

  let browser;

  await mkdir(path.dirname(pdfPath), { recursive: true });
  await mkdir(path.dirname(outPdfPath), { recursive: true });
  await new Promise((resolve) => server.listen(port, resolve));

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(`${baseUrl}/flyer`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: pdfPath,
      format: "letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await page.pdf({
      path: outPdfPath,
      format: "letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser?.close();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

try {
  if (process.env.VERCEL && (await copyExistingPdf())) {
    console.log(`Skipped PDF generation on Vercel; reused ${pdfPath}`);
  } else {
    await renderPdf();
    console.log(`Flyer PDF saved to ${pdfPath}`);
  }
} catch (error) {
  if (await copyExistingPdf()) {
    console.warn(
      `PDF generation failed; reused existing ${pdfPath}. ${error instanceof Error ? error.message : String(error)}`,
    );
  } else {
    throw error;
  }
}
