import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  flyerEditorSessionCookieName,
  hasValidFlyerEditorSessionToken,
} from "../../../../lib/flyerAuth";
import {
  buildFlyerResponse,
  buildFlyerVersionSummary,
  createFlyerVersion,
  listFlyerVersions,
} from "../../../../lib/flyerService";
import { getRequestOrigin } from "../../../../lib/requestOrigin";

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

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as { content?: unknown; pdfBase64?: string };
    const pdfBuffer =
      typeof body.pdfBase64 === "string" && body.pdfBase64.length > 0
        ? Buffer.from(body.pdfBase64, "base64")
        : undefined;
    const createdVersion = await createFlyerVersion(slug, body.content ?? body, pdfBuffer);
    const origin = await getRequestOrigin();

    return NextResponse.json(buildFlyerResponse(origin, createdVersion), {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to publish flyer changes.",
      },
      { status: 500 },
    );
  }
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

  try {
    const { slug } = await context.params;
    const documents = await listFlyerVersions(slug);
    const origin = await getRequestOrigin();

    return NextResponse.json(
      documents.map((document) => buildFlyerVersionSummary(origin, document)),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load flyer versions.",
      },
      { status: 500 },
    );
  }
}
