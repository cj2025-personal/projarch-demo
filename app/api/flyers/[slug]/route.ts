import { NextResponse } from "next/server";
import { getLatestFlyerDocument } from "../../../lib/flyerDb";
import { buildFlyerResponse } from "../../../lib/flyerService";
import { getRequestOrigin } from "../../../lib/requestOrigin";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const document = await getLatestFlyerDocument(slug);

    if (!document) {
      return NextResponse.json(
        {
          error: "No published flyer version was found.",
        },
        { status: 404 },
      );
    }

    const origin = await getRequestOrigin();

    return NextResponse.json(buildFlyerResponse(origin, document), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load flyer content.",
      },
      { status: 500 },
    );
  }
}
