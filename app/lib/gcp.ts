import { Storage } from "@google-cloud/storage";
import { existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

let configured = false;
let storageClient: Storage | null = null;

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function configureGcpCredentials() {
  if (configured) {
    return;
  }

  const inlineJson = process.env.GCP_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    const credentialsPath = path.join(tmpdir(), "gcp-service-account.json");
    writeFileSync(credentialsPath, inlineJson, "utf8");
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    configured = true;
    return;
  }

  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (configuredPath) {
    const resolvedPath = path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(process.cwd(), configuredPath);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
    configured = true;
    return;
  }

  const localKeyPath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "demo-be",
    "config",
    "key.json",
  );
  if (existsSync(localKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
    configured = true;
    return;
  }

  throw new Error(
    "Missing GCP credentials. Set GCP_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

export function getStorageClient() {
  configureGcpCredentials();

  if (!storageClient) {
    storageClient = new Storage({
      projectId: requireEnv("GCP_PROJECT_ID"),
    });
  }

  return storageClient;
}

export function getBucketName() {
  return requireEnv("BUCKET_NAME");
}
