import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../demo-be/.env") });

const slug = process.argv[2]?.trim() || "project-arch";
const keepVersion = Number(process.argv[3] ?? "4");
const collectionName = process.env.FLYER_COLLECTION_NAME?.trim() || "flyer_versions";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const mongoClient = new MongoClient(requireEnv("MONGODB_URI"));
const dbName = requireEnv("MONGODB_DB");

try {
  await mongoClient.connect();
  const collection = mongoClient.db(dbName).collection(collectionName);

  const existing = await collection
    .find({ slug })
    .sort({ version: 1 })
    .project({ version: 1, createdAt: 1, "pdf.key": 1 })
    .toArray();

  console.log(`Found ${existing.length} version(s) for slug "${slug}":`);
  for (const document of existing) {
    console.log(`- v${document.version} (${document.createdAt}) ${document.pdf?.key ?? "no pdf key"}`);
  }

  const keepDocument = await collection.findOne({ slug, version: keepVersion });
  if (!keepDocument) {
    throw new Error(`Version v${keepVersion} for slug "${slug}" was not found. Nothing deleted.`);
  }

  const deleteResult = await collection.deleteMany({
    slug,
    version: { $ne: keepVersion },
  });

  console.log(`\nDeleted ${deleteResult.deletedCount} older version(s).`);
  console.log(`Kept v${keepVersion}: ${keepDocument.pdf?.key ?? "no pdf key"}`);
} finally {
  await mongoClient.close();
}
