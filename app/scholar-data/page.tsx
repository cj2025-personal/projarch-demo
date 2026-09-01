import type { Metadata } from "next";
import { ScholarDataDownloadPage } from "../components/ScholarDataDownloadPage";
import "../flyer/flyer-page.css";

export const metadata: Metadata = {
  title: "Scholar Data Flyer | Project Arch",
  description:
    "How Project Arch collects, organizes, and cites scholar material, explained for teachers and school leaders.",
};

export default function ScholarDataPage() {
  return (
    <main className="flyer-page flyer-page-public">
      <ScholarDataDownloadPage />
    </main>
  );
}
