import { timingSafeEqual } from "node:crypto";

export const flyerEditorPath = "/flyer/edit";
export const flyerEditorLoginPath = `${flyerEditorPath}/login`;
export const flyerEditorSessionCookieName = "flyer_editor_session";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getEditorUsername() {
  return process.env.FLYER_EDITOR_USERNAME?.trim() || "admin";
}

function getEditorPassword() {
  return process.env.FLYER_EDITOR_PASSWORD?.trim() || "admin@1234";
}

export function isFlyerEditorCredentialsValid(username: string, password: string) {
  return safeEqual(username, getEditorUsername()) && safeEqual(password, getEditorPassword());
}

export function createFlyerEditorSessionToken() {
  return Buffer.from(`${getEditorUsername()}:${getEditorPassword()}`, "utf8").toString(
    "base64url",
  );
}

export function hasValidFlyerEditorSessionToken(value: string | undefined) {
  return typeof value === "string" && safeEqual(value, createFlyerEditorSessionToken());
}

export function getFlyerApiBaseUrl() {
  const configuredBaseUrl =
    process.env.FLYER_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_FLYER_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  return "http://localhost:8003";
}

export function getFlyerPublishAuthorizationHeader() {
  const username = process.env.FLYER_PUBLISH_USERNAME?.trim() || getEditorUsername();
  const password = process.env.FLYER_PUBLISH_PASSWORD?.trim() || getEditorPassword();
  const encoded = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
  return `Basic ${encoded}`;
}
