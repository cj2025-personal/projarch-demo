import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  flyerEditorSessionCookieName,
  getFlyerApiBaseUrl,
  getFlyerPublishAuthorizationHeader,
  hasValidFlyerEditorSessionToken,
} from "../../../../lib/flyerAuth";

export const runtime = "nodejs";

function createUnauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized.",
    },
    { status: 401 },
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(flyerEditorSessionCookieName)?.value;

  if (!hasValidFlyerEditorSessionToken(sessionToken)) {
    return createUnauthorizedResponse();
  }

  const { slug } = await context.params;
  const backendResponse = await fetch(`${getFlyerApiBaseUrl()}/api/flyers/${slug}/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getFlyerPublishAuthorizationHeader(),
    },
    body: await request.text(),
    cache: "no-store",
  });

  const responseText = await backendResponse.text();

  return new Response(responseText, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(flyerEditorSessionCookieName)?.value;

  if (!hasValidFlyerEditorSessionToken(sessionToken)) {
    return createUnauthorizedResponse();
  }

  const { slug } = await context.params;
  const backendResponse = await fetch(`${getFlyerApiBaseUrl()}/api/flyers/${slug}/versions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: getFlyerPublishAuthorizationHeader(),
    },
    cache: "no-store",
  });

  const responseText = await backendResponse.text();

  return new Response(responseText, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}
