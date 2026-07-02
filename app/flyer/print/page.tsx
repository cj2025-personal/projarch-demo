import { Suspense } from "react";
import { FlyerPrintPageClient } from "../../components/FlyerPrintPageClient";
import "../flyer-page.css";

export default function FlyerPrintPage() {
  return (
    <Suspense fallback={<main className="flyer-page flyer-page-print" />}>
      <FlyerPrintPageClient />
    </Suspense>
  );
}
