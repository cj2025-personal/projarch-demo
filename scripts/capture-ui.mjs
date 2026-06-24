import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outputDir = path.resolve("design-capture");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

await page.evaluate(async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let y = 0; y <= document.body.scrollHeight; y += 320) {
    window.scrollTo(0, y);
    await delay(120);
  }

  window.scrollTo(0, document.body.scrollHeight);
  await delay(300);
  window.scrollTo(0, 0);
  await delay(300);
});

await page.waitForFunction(
  () => document.querySelectorAll(".feature-card.is-visible").length >= 8,
  { timeout: 15000 },
);

await page.screenshot({
  path: path.join(outputDir, "sleek-desktop-full.png"),
  fullPage: true,
});

await page.screenshot({
  path: path.join(outputDir, "sleek-desktop-hero.png"),
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(baseUrl, { waitUntil: "networkidle" });
await mobile.waitForTimeout(600);

await mobile.evaluate(async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let y = 0; y <= document.body.scrollHeight; y += 280) {
    window.scrollTo(0, y);
    await delay(120);
  }

  window.scrollTo(0, document.body.scrollHeight);
  await delay(300);
  window.scrollTo(0, 0);
  await delay(300);
});

await mobile.waitForFunction(
  () => document.querySelectorAll(".feature-card.is-visible").length >= 8,
  { timeout: 15000 },
);

await mobile.screenshot({
  path: path.join(outputDir, "sleek-mobile-full.png"),
  fullPage: true,
});

const pageData = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector("h1")?.textContent?.trim(),
  sectionCount: document.querySelectorAll("main section").length,
  featureCards: document.querySelectorAll(".feature-card").length,
  hasHeroBrand: Boolean(document.querySelector(".hero-brand")),
}));

const metadata = {
  capturedAt: new Date().toISOString(),
  url: baseUrl,
  viewports: ["1440x900", "390x844"],
  sections: [
    "header",
    "hero",
    "trust-bar",
    "problem",
    "platform",
    "approach",
    "impact",
    "cta",
    "footer",
  ],
  palette: {
    patriotBlue: "#002868",
    patriotNavy: "#0b255f",
    patriotRed: "#b22234",
    accentBlue: "#4f7cff",
    accentRed: "#ef4c4f",
  },
  pageData,
};

console.log(JSON.stringify(metadata, null, 2));
console.log(`Screenshots saved to ${outputDir}`);

await browser.close();
