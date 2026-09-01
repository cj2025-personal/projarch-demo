import type { Metadata } from "next";
import { ScholarDataEditor } from "../../components/ScholarDataEditor";
import "../../flyer/flyer-page.css";

export const metadata: Metadata = {
  title: "Private Scholar Data Flyer Editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScholarDataEditorPage() {
  return (
    <main className="flyer-page">
      <ScholarDataEditor />
    </main>
  );
}
