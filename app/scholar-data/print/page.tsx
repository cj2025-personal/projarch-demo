import { Suspense } from "react";
import { ScholarDataPrintPageClient } from "../../components/ScholarDataPrintPageClient";
import "../../flyer/flyer-page.css";

export default function ScholarDataPrintPage() {
  return (
    <Suspense fallback={<main className="flyer-page flyer-page-print" />}>
      <ScholarDataPrintPageClient />
    </Suspense>
  );
}
