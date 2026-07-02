import type { Metadata } from "next";
import { FlyerEditor } from "../../components/FlyerEditor";
import "../flyer-page.css";

export const metadata: Metadata = {
  title: "Private Flyer Editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FlyerEditorPage() {
  return (
    <main className="flyer-page">
      <FlyerEditor />
    </main>
  );
}
