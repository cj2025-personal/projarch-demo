import { Collection, MongoClient } from "mongodb";
import type { FlyerContent } from "../content/flyerContent";

export type StoredFlyerPdf = {
  bucket: string;
  contentType: string;
  etag: string | null;
  key: string;
  size: number;
};

export type FlyerDocument = {
  slug: string;
  version: number;
  content: FlyerContent;
  pdf: StoredFlyerPdf;
  createdAt: string;
  updatedAt: string;
};

type FlyerDbGlobal = typeof globalThis & {
  _flyerMongoClient?: MongoClient;
  _flyerIndexesReady?: Promise<void>;
};

const globalForFlyerDb = globalThis as FlyerDbGlobal;

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getCollectionName() {
  return process.env.FLYER_COLLECTION_NAME?.trim() || "flyer_versions";
}

async function getMongoClient() {
  if (!globalForFlyerDb._flyerMongoClient) {
    globalForFlyerDb._flyerMongoClient = new MongoClient(requireEnv("MONGODB_URI"));
    await globalForFlyerDb._flyerMongoClient.connect();
  }

  return globalForFlyerDb._flyerMongoClient;
}

async function ensureIndexes(collection: Collection<FlyerDocument>) {
  if (!globalForFlyerDb._flyerIndexesReady) {
    globalForFlyerDb._flyerIndexesReady = Promise.all([
      collection.createIndex({ slug: 1, version: 1 }, { unique: true }),
      collection.createIndex({ slug: 1, createdAt: -1 }),
    ]).then(() => undefined);
  }

  await globalForFlyerDb._flyerIndexesReady;
}

export async function getFlyerCollection() {
  const client = await getMongoClient();
  const collection = client
    .db(requireEnv("MONGODB_DB"))
    .collection<FlyerDocument>(getCollectionName());
  await ensureIndexes(collection);
  return collection;
}

export async function getLatestFlyerDocument(slug: string) {
  const collection = await getFlyerCollection();
  return collection.findOne({ slug }, { sort: { version: -1 } });
}

export async function getFlyerDocumentByVersion(slug: string, version: number) {
  const collection = await getFlyerCollection();
  return collection.findOne({ slug, version });
}
