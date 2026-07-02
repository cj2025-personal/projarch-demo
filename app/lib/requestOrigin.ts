import { headers } from "next/headers";

export async function getRequestOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (!host) {
    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
      return `https://${vercelUrl.replace(/\/+$/, "")}`;
    }

    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}
