import { NextResponse } from "next/server";
import { getFlyerDocumentByVersion } from "../../../../../../lib/flyerDb";
import { downloadFlyerPdf } from "../../../../../../lib/flyerService";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string; version: string }> },
) {
  try {
    const { slug, version: versionParam } = await context.params;
    const version = Number(versionParam);
    const document = await getFlyerDocumentByVersion(slug, version);

    if (!document) {
      return NextResponse.json(
        {
          error: "The requested flyer PDF version was not found.",
        },
        { status: 404 },
      );
    }

    const pdfBuffer = await downloadFlyerPdf(document.pdf);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": document.pdf.contentType || "application/pdf",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${document.slug}-flyer-v${document.version}.pdf"`,
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
