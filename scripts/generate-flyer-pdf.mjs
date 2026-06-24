import { createServer } from "node:http";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import handler from "serve-handler";

const port = 3456;
const siteRoot = path.resolve("out");
const pdfPath = path.resolve("public/project-arch-flyer.pdf");
const outPdfPath = path.resolve("out/project-arch-flyer.pdf");
const baseUrl = `http://127.0.0.1:${port}`;

const server = createServer((request, response) =>
  handler(request, response, { public: siteRoot }),
);

await mkdir(path.dirname(pdfPath), { recursive: true });

await new Promise((resolve) => server.listen(port, resolve));

const browser = await chromium.launch();
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

await browser.close();
server.close();

console.log(`Flyer PDF saved to ${pdfPath}`);
