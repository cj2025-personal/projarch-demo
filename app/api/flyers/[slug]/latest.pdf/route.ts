import { NextResponse } from "next/server";
import { getLatestFlyerDocument } from "../../../../lib/flyerDb";
import { downloadFlyerPdf } from "../../../../lib/flyerService";
import { selectFlyerPdf } from "../../../../lib/flyerPdfPage";

export const runtime = "nodejs";

export async function GET(
  request: Request,
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

    const pageParam = new URL(request.url).searchParams.get("page");
    const selection = selectFlyerPdf(document, pageParam);

    if (!selection.ok) {
      return NextResponse.json({ error: selection.error }, { status: 404 });
    }

    const pdfBuffer = await downloadFlyerPdf(selection.pdf);
    const filename = `${document.slug}-flyer-latest${selection.filenameSuffix}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": selection.pdf.contentType || "application/pdf",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(selection.pdf.size),
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
