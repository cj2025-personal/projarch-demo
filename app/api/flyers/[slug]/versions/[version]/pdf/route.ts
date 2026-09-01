import { NextResponse } from "next/server";
import { getFlyerDocumentByVersion } from "../../../../../../lib/flyerDb";
import { downloadFlyerPdf } from "../../../../../../lib/flyerService";
import { selectFlyerPdf } from "../../../../../../lib/flyerPdfPage";

export const runtime = "nodejs";

export async function GET(
  request: Request,
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

    const pageParam = new URL(request.url).searchParams.get("page");
    const selection = selectFlyerPdf(document, pageParam);

    if (!selection.ok) {
      return NextResponse.json({ error: selection.error }, { status: 404 });
    }

    const pdfBuffer = await downloadFlyerPdf(selection.pdf);
    const filename = `${document.slug}-flyer-v${document.version}${selection.filenameSuffix}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": selection.pdf.contentType || "application/pdf",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(selection.pdf.size),
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
