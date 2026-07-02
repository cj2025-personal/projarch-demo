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
    const message = error instanceof Error ? error.message : "Unable to stream flyer PDF.";

    return NextResponse.json(
      {
        error: message.includes("No such object")
          ? "The latest flyer PDF is missing from storage. Open the editor and publish again to regenerate it."
          : message,
      },
      { status: message.includes("No such object") ? 404 : 500 },
    );
  }
}
