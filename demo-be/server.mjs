import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Storage } from "@google-cloud/storage";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { chromium } from "playwright";
import handler from "serve-handler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

function configureGcpCredentials() {
  const inlineJson = process.env.GCP_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    const credentialsPath = path.join(tmpdir(), "gcp-service-account.json");
    writeFileSync(credentialsPath, inlineJson, "utf8");
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    return credentialsPath;
  }

  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (configuredPath) {
    const resolvedPath = path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(__dirname, configuredPath);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
    return resolvedPath;
  }

  const defaultKeyPath = path.resolve(__dirname, "config", "key.json");
  if (existsSync(defaultKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultKeyPath;
    return defaultKeyPath;
  }

  throw new Error(
    "Missing GCP credentials. Set GCP_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

const flyerSlug = "project-arch";
const collectionName = process.env.FLYER_COLLECTION_NAME?.trim() || "flyer_versions";
const port = Number(process.env.PORT || 8003);

const defaultFlyerContent = {
  frontEyebrow: "Concept Flyer",
  backEyebrow: "What is inside",
  heroCardTitle: "Platform snapshot",
  companyName: "Project Arch",
  companyTagline: "From archives to you, accelerated by AI",
  conceptOneLiner:
    "Project Arch is an announced concept that turns scholar research into AI-guided reading support for students.",
  companyMission:
    "Built for K12-14 learners, educators, and academic partners. Announced concept only.",
  scopeHeading: "Initial scope",
  scopeNote:
    "The first scholar directory centers on Big Ten universities in the United States with grade-aware experiences for K12-14 students.",
  frontFeatureRows: [
    {
      title: "Veri AI",
      detail:
        "A scholar-specific chatbot delivering grade-personalized answers grounded in each scholar's research and academic voice.",
      icon: "chat",
    },
    {
      title: "Scholar Directory",
      detail:
        "A searchable Big Ten scholar directory built for discovery, context, and research access.",
      icon: "directory",
    },
    {
      title: "AI Scholar Podcasts",
      detail:
        "AI-generated scholar conversations that surface shared themes, debate, and cross-disciplinary insight.",
      icon: "podcast",
    },
    {
      title: "Editorial and Curated Stories",
      detail:
        "AI editorials and scholar-curated stories that turn research into readable narratives for learners.",
      icon: "editorial",
    },
  ],
  summaryHeading: "Why it matters",
  valuePillars: [
    { label: "Scholar-led", detail: "Grounded in real academic voices and research" },
    { label: "Grade-aware", detail: "Answers personalized by student reading level" },
    { label: "Story-driven", detail: "Research transformed into engaging learning media" },
  ],
  featurePersonalization:
    "Explanations, tone, and depth adjust for different grades and learning communities.",
  featureGoal: "Build a new American model for reading comprehension.",
  valueSummary: [
    {
      label: "Students",
      detail: "Get clearer answers from difficult academic material",
    },
    {
      label: "Educators",
      detail: "Bring scholar-backed reading support into instruction",
    },
    {
      label: "Partners",
      detail: "Explore pilots, sponsorships, and investment opportunities",
    },
  ],
  featuresHeading: "Platform Features",
  featuresIntro:
    "The back page outlines the core product layers that shape the Project Arch learning experience.",
  platformFeatures: [
    "A Big Ten-centered scholar directory with research profiles, background context, and discovery pathways for students.",
    "Access to both legacy scholars and contemporary researchers across major R1 university ecosystems.",
    "Veri AI responses grounded in scholar-specific materials rather than generic chatbot output.",
    "Grade-personalized explanations that adapt reading level, tone, and depth for K12-14 learners.",
    "AI-assisted reading comprehension activities built to help students work through difficult texts with confidence.",
    "AI-generated scholar-to-scholar podcast conversations that surface overlap, tension, and interdisciplinary insight.",
    "Recorded and live audio formats that make academic knowledge more accessible and engaging.",
    "Editorial publishing powered by both AI generation and scholar-curated contributions.",
    "Perspective stories and commentary that connect research to current issues, culture, and public life.",
    "A platform model designed to support healthier comprehension, stronger writing development, and more meaningful student learning.",
  ],
  collaborationHeading: "Next step",
  collaborationBody:
    "Private concept materials, pilot discussions, and partnership conversations are available for selected collaborators, sponsors, and investors.",
  backNoteHeading: "Flyer note",
  ideatorLabel: "Ideated by",
  ideator: "Dr. Craig L Johnson",
  contactLine:
    "For collaboration, sponsorship, and investment interest, connect through the private Project Arch outreach process.",
  contactEmail: "",
  qrTitle: "",
  qrSubtitle: "",
  footerNote:
    "Project Arch - announced concept only. Big Ten is a registered trademark of the Big Ten Conference.",
};

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function trimString(value, fallback) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function stringValue(value, fallback) {
  return typeof value === "string" ? value : fallback;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pairArray(value, fallback) {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) && typeof item.label === "string" && typeof item.detail === "string",
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    label: trimString(item.label, ""),
    detail: trimString(item.detail, ""),
  }));
}

function featureRowArray(value, fallback) {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.detail === "string" &&
        (item.icon === "chat" ||
          item.icon === "directory" ||
          item.icon === "podcast" ||
          item.icon === "editorial"),
    )
  ) {
    return fallback;
  }

  return value.map((item) => ({
    title: trimString(item.title, ""),
    detail: trimString(item.detail, ""),
    icon: item.icon,
  }));
}

function stringArray(value, fallback) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return fallback;
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function normalizeFlyerContent(value) {
  const input = isRecord(value) ? value : {};

  return {
    frontEyebrow: stringValue(input.frontEyebrow, defaultFlyerContent.frontEyebrow),
    backEyebrow: stringValue(input.backEyebrow, defaultFlyerContent.backEyebrow),
    heroCardTitle: stringValue(input.heroCardTitle, "Platform snapshot"),
    companyName: trimString(input.companyName, defaultFlyerContent.companyName),
    companyTagline: trimString(input.companyTagline, defaultFlyerContent.companyTagline),
    conceptOneLiner: stringValue(input.conceptOneLiner, defaultFlyerContent.conceptOneLiner),
    companyMission: stringValue(input.companyMission, defaultFlyerContent.companyMission),
    scopeHeading: stringValue(input.scopeHeading, defaultFlyerContent.scopeHeading),
    scopeNote: stringValue(input.scopeNote, defaultFlyerContent.scopeNote),
    frontFeatureRows: featureRowArray(
      input.frontFeatureRows,
      defaultFlyerContent.frontFeatureRows,
    ),
    summaryHeading: stringValue(input.summaryHeading, "Why it matters"),
    valuePillars: pairArray(input.valuePillars, defaultFlyerContent.valuePillars),
    featurePersonalization: stringValue(
      input.featurePersonalization,
      defaultFlyerContent.featurePersonalization,
    ),
    featureGoal: stringValue(input.featureGoal, defaultFlyerContent.featureGoal),
    valueSummary: pairArray(input.valueSummary, defaultFlyerContent.valueSummary),
    featuresHeading: stringValue(input.featuresHeading, defaultFlyerContent.featuresHeading),
    featuresIntro: stringValue(input.featuresIntro, defaultFlyerContent.featuresIntro),
    platformFeatures: stringArray(
      input.platformFeatures,
      defaultFlyerContent.platformFeatures,
    ),
    collaborationHeading: stringValue(
      input.collaborationHeading,
      defaultFlyerContent.collaborationHeading,
    ),
    collaborationBody: stringValue(
      input.collaborationBody,
      defaultFlyerContent.collaborationBody,
    ),
    backNoteHeading: stringValue(input.backNoteHeading, "Flyer note"),
    ideatorLabel: stringValue(input.ideatorLabel, defaultFlyerContent.ideatorLabel),
    ideator: stringValue(input.ideator, defaultFlyerContent.ideator),
    contactLine: stringValue(input.contactLine, defaultFlyerContent.contactLine),
    contactEmail: stringValue(input.contactEmail, defaultFlyerContent.contactEmail),
    qrTitle: stringValue(input.qrTitle, defaultFlyerContent.qrTitle),
    qrSubtitle: stringValue(input.qrSubtitle, defaultFlyerContent.qrSubtitle),
    footerNote: stringValue(input.footerNote, defaultFlyerContent.footerNote),
  };
}

function getPublishUsername() {
  return process.env.FLYER_PUBLISH_USERNAME?.trim() || "admin";
}

function getPublishPassword() {
  return process.env.FLYER_PUBLISH_PASSWORD?.trim() || "admin@1234";
}

function isAuthorizedPublishRequest(request) {
  const authorization = request.get("authorization");
  if (!authorization || !authorization.startsWith("Basic ")) {
    return false;
  }

  const encodedCredentials = authorization.slice("Basic ".length).trim();
  const expectedCredentials = Buffer.from(
    `${getPublishUsername()}:${getPublishPassword()}`,
    "utf8",
  ).toString("base64");

  return safeEqual(encodedCredentials, expectedCredentials);
}

configureGcpCredentials();

const mongoClient = new MongoClient(requireEnv("MONGODB_URI"));
const dbName = requireEnv("MONGODB_DB");
const bucketName = requireEnv("BUCKET_NAME");
const gcpProjectId = requireEnv("GCP_PROJECT_ID");
const storage = new Storage({ projectId: gcpProjectId });
const gcsBucket = storage.bucket(bucketName);

await mongoClient.connect();

const flyerCollection = mongoClient.db(dbName).collection(collectionName);

await flyerCollection.createIndex({ slug: 1, version: 1 }, { unique: true });
await flyerCollection.createIndex({ slug: 1, createdAt: -1 });

function buildAbsoluteUrl(request, pathname) {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const protocol =
    typeof forwardedProtocol === "string" && forwardedProtocol.length > 0
      ? forwardedProtocol
      : request.protocol;
  const host = request.headers["x-forwarded-host"] || request.get("host");
  return `${protocol}://${host}${pathname}`;
}

function buildFlyerResponse(request, document) {
  return {
    slug: document.slug,
    version: document.version,
    content: document.content,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    latestPdfUrl: buildAbsoluteUrl(
      request,
      `/api/flyers/${document.slug}/latest.pdf`,
    ),
    versionPdfUrl: buildAbsoluteUrl(
      request,
      `/api/flyers/${document.slug}/versions/${document.version}/pdf`,
    ),
  };
}

function buildFlyerVersionSummary(request, document) {
  return {
    slug: document.slug,
    version: document.version,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    latestPdfUrl: buildAbsoluteUrl(
      request,
      `/api/flyers/${document.slug}/latest.pdf`,
    ),
    versionPdfUrl: buildAbsoluteUrl(
      request,
      `/api/flyers/${document.slug}/versions/${document.version}/pdf`,
    ),
  };
}

async function getLatestFlyerDocument(slug) {
  return flyerCollection.findOne(
    { slug },
    { sort: { version: -1 } },
  );
}

async function ensurePathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function withFlyerPrintOrigin(run) {
  const configuredOrigin = process.env.FLYER_PRINT_ORIGIN?.trim();
  if (configuredOrigin) {
    return run(configuredOrigin.replace(/\/+$/, ""));
  }

  const siteRoot = path.resolve(__dirname, "..", "out");
  const hasExport = await ensurePathExists(siteRoot);
  if (!hasExport) {
    throw new Error(
      "Static frontend export not found. Build the frontend or set FLYER_PRINT_ORIGIN for backend PDF generation.",
    );
  }

  const server = createServer((request, response) =>
    handler(request, response, { public: siteRoot }),
  );

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to start local flyer print server.");
  }

  const origin = `http://127.0.0.1:${address.port}`;

  try {
    return await run(origin);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

function launchBrowser() {
  return chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function generateFlyerPdf(content) {
  const encodedContent = Buffer.from(JSON.stringify(content), "utf8").toString("base64url");

  return withFlyerPrintOrigin(async (origin) => {
    const browser = await launchBrowser();

    try {
      const page = await browser.newPage();
      await page.goto(`${origin}/flyer/print?data=${encodeURIComponent(encodedContent)}`, {
        waitUntil: "networkidle",
        timeout: 120_000,
      });
      await page.waitForSelector(".flyer-document");
      await page.emulateMedia({ media: "print" });
      await page.evaluate(async () => {
        try {
          await document.fonts.ready;
        } catch {
          // Continue even if font readiness is unavailable.
        }
      });

      return await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
    } finally {
      await browser.close();
    }
  });
}

async function uploadFlyerPdf(slug, version, pdfBuffer) {
  const objectKey = `flyers/${slug}/versions/v${version}-${Date.now()}-${randomUUID()}.pdf`;
  const file = gcsBucket.file(objectKey);
  const uploadOptions = {
    contentType: "application/pdf",
    metadata: {
      cacheControl: "no-store",
      metadata: {
        slug,
        version: String(version),
      },
    },
  };

  try {
    await file.save(pdfBuffer, uploadOptions);
  } catch (error) {
    if (error?.code !== 404) {
      throw error;
    }

    await ensureBucketExists();
    await file.save(pdfBuffer, uploadOptions);
  }

  const [metadata] = await file.getMetadata();

  return {
    bucket: bucketName,
    contentType: "application/pdf",
    etag: metadata.etag ?? null,
    key: objectKey,
    size: pdfBuffer.byteLength,
  };
}

async function ensureBucketExists() {
  const [exists] = await gcsBucket.exists();
  if (exists) {
    return;
  }

  const location = process.env.GCP_LOCATION?.trim() || "US";
  await storage.createBucket(bucketName, { location });
}

async function createFlyerVersion(slug, content) {
  const pdfBuffer = await generateFlyerPdf(content);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const latestDocument = await getLatestFlyerDocument(slug);
    const nextVersion = (latestDocument?.version ?? 0) + 1;
    const uploadedPdf = await uploadFlyerPdf(slug, nextVersion, pdfBuffer);
    const now = new Date().toISOString();
    const document = {
      slug,
      version: nextVersion,
      content,
      pdf: uploadedPdf,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await flyerCollection.insertOne(document);
      return document;
    } catch (error) {
      if (error?.code === 11000) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to allocate a new flyer version after multiple attempts.");
}

async function streamPdfFromGcs(response, pdf) {
  const file = storage.bucket(pdf.bucket).file(pdf.key);
  const stream = file.createReadStream();

  response.setHeader("Content-Type", pdf.contentType || "application/pdf");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Length", String(pdf.size));
  stream.pipe(response);
}

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "project-arch-flyer-backend",
  });
});

app.get("/api/flyers/:slug", async (request, response) => {
  try {
    const document = await getLatestFlyerDocument(request.params.slug);
    if (!document) {
      response.status(404).json({
        error: "No published flyer version was found.",
      });
      return;
    }

    response.setHeader("Cache-Control", "no-store");
    response.json(buildFlyerResponse(request, document));
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unable to load flyer content.",
    });
  }
});

app.post("/api/flyers/:slug/versions", async (request, response) => {
  if (!isAuthorizedPublishRequest(request)) {
    response.setHeader("WWW-Authenticate", 'Basic realm="Project Arch Flyer Editor"');
    response.status(401).json({
      error: "Unauthorized.",
    });
    return;
  }

  try {
    const requestedSlug = request.params.slug || flyerSlug;
    const normalizedContent = normalizeFlyerContent(request.body?.content ?? request.body);
    const createdVersion = await createFlyerVersion(requestedSlug, normalizedContent);
    response.status(201).json(buildFlyerResponse(request, createdVersion));
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unable to publish flyer changes.",
    });
  }
});

app.get("/api/flyers/:slug/versions", async (request, response) => {
  if (!isAuthorizedPublishRequest(request)) {
    response.setHeader("WWW-Authenticate", 'Basic realm="Project Arch Flyer Editor"');
    response.status(401).json({
      error: "Unauthorized.",
    });
    return;
  }

  try {
    const documents = await flyerCollection
      .find({ slug: request.params.slug })
      .sort({ version: -1 })
      .limit(25)
      .toArray();

    response.setHeader("Cache-Control", "no-store");
    response.json(documents.map((document) => buildFlyerVersionSummary(request, document)));
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unable to load flyer versions.",
    });
  }
});

app.get("/api/flyers/:slug/latest.pdf", async (request, response) => {
  try {
    const document = await getLatestFlyerDocument(request.params.slug);
    if (!document) {
      response.status(404).json({
        error: "No published flyer PDF was found.",
      });
      return;
    }

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.slug}-flyer-latest.pdf"`,
    );
    await streamPdfFromGcs(response, document.pdf);
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unable to stream flyer PDF.",
    });
  }
});

app.get("/api/flyers/:slug/versions/:version/pdf", async (request, response) => {
  try {
    const version = Number(request.params.version);
    const document = await flyerCollection.findOne({
      slug: request.params.slug,
      version,
    });

    if (!document) {
      response.status(404).json({
        error: "The requested flyer PDF version was not found.",
      });
      return;
    }

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.slug}-flyer-v${document.version}.pdf"`,
    );
    await streamPdfFromGcs(response, document.pdf);
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unable to stream flyer PDF.",
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Project Arch flyer backend listening on port ${port} using collection "${collectionName}"`,
  );
});
