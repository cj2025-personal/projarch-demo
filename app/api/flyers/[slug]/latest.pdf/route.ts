import { NextResponse } from "next/server";
import { getLatestFlyerDocument } from "../../../../lib/flyerDb";
import { downloadFlyerPdf } from "../../../../lib/flyerService";

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
          error: "No published flyer PDF was found.",
        },
        { status: 404 },
      );
    }

    const pdfBuffer = await downloadFlyerPdf(document.pdf);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": document.pdf.contentType || "application/pdf",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${document.slug}-flyer-latest.pdf"`,
        "Content-Length": String(document.pdf.size),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to stream flyer PDF.",
      },
      { status: 500 },
    );
  }
}
