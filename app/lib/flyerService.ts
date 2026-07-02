import { randomUUID } from "node:crypto";
import type { FlyerContent } from "../content/flyerContent";
import { getBucketName, getStorageClient } from "./gcp";
import {
  type FlyerDocument,
  type StoredFlyerPdf,
  getFlyerCollection,
  getLatestFlyerDocument,
} from "./flyerDb";
import { generateFlyerPdf } from "./flyerPdf";
import { normalizeFlyerContent } from "./flyerNormalize";

export type FlyerVersionResponse = {
  slug: string;
  version: number;
  content: FlyerContent;
  createdAt: string;
  updatedAt: string;
  latestPdfUrl: string;
  versionPdfUrl: string;
};

export type FlyerVersionSummary = Omit<FlyerVersionResponse, "content">;

function buildAbsoluteUrl(origin: string, pathname: string) {
  return `${origin.replace(/\/+$/, "")}${pathname}`;
}

export function buildFlyerResponse(origin: string, document: FlyerDocument): FlyerVersionResponse {
  return {
    slug: document.slug,
    version: document.version,
    content: document.content,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    latestPdfUrl: buildAbsoluteUrl(origin, `/api/flyers/${document.slug}/latest.pdf`),
    versionPdfUrl: buildAbsoluteUrl(
      origin,
      `/api/flyers/${document.slug}/versions/${document.version}/pdf`,
    ),
  };
}

export function buildFlyerVersionSummary(
  origin: string,
  document: FlyerDocument,
): FlyerVersionSummary {
  const { content: _content, ...summary } = buildFlyerResponse(origin, document);
  return summary;
}

async function ensureBucketExists(bucketName: string) {
  const storage = getStorageClient();
  const bucket = storage.bucket(bucketName);
  const [exists] = await bucket.exists();

  if (exists) {
    return bucket;
  }

  const location = process.env.GCP_LOCATION?.trim() || "US";
  await storage.createBucket(bucketName, { location });
  return bucket;
}

async function uploadFlyerPdf(slug: string, version: number, pdfBuffer: Buffer) {
  const bucketName = getBucketName();
  const objectKey = `flyers/${slug}/versions/v${version}-${Date.now()}-${randomUUID()}.pdf`;
  const bucket = await ensureBucketExists(bucketName);
  const file = bucket.file(objectKey);
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

  await file.save(pdfBuffer, uploadOptions);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error(`Uploaded flyer PDF was not found in ${bucketName}/${objectKey}.`);
  }

  const [metadata] = await file.getMetadata();

  return {
    bucket: bucketName,
    contentType: "application/pdf",
    etag: metadata.etag ?? null,
    key: objectKey,
    size: pdfBuffer.byteLength,
  } satisfies StoredFlyerPdf;
}

export async function createFlyerVersion(slug: string, content: unknown, pdfBuffer?: Buffer) {
  const normalizedContent = normalizeFlyerContent(content);

  let resolvedPdfBuffer = pdfBuffer;
  if (!resolvedPdfBuffer) {
    if (process.env.VERCEL) {
      throw new Error("PDF data is required when publishing on Vercel.");
    }

    resolvedPdfBuffer = await generateFlyerPdf(normalizedContent);
  }

  const collection = await getFlyerCollection();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const latestDocument = await getLatestFlyerDocument(slug);
    const nextVersion = (latestDocument?.version ?? 0) + 1;
    const uploadedPdf = await uploadFlyerPdf(slug, nextVersion, resolvedPdfBuffer);
    const now = new Date().toISOString();
    const document: FlyerDocument = {
      slug,
      version: nextVersion,
      content: normalizedContent,
      pdf: uploadedPdf,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await collection.insertOne(document);
      return document;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to allocate a new flyer version after multiple attempts.");
}

export async function downloadFlyerPdf(pdf: StoredFlyerPdf) {
  const file = getStorageClient().bucket(pdf.bucket).file(pdf.key);
  const [buffer] = await file.download();
  return buffer;
}

export async function listFlyerVersions(slug: string) {
  const collection = await getFlyerCollection();
  return collection.find({ slug }).sort({ version: -1 }).limit(25).toArray();
}
