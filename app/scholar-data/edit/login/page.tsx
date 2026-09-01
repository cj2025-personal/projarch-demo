import { Suspense } from "react";
import type { Metadata } from "next";
import { FlyerEditorLogin } from "../../../components/FlyerEditorLogin";
import { scholarDataEditorPath } from "../../../lib/flyerAuth";
import "../../../flyer/flyer-page.css";

export const metadata: Metadata = {
  title: "Scholar Data Flyer Editor Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScholarDataEditorLoginPage() {
  return (
    <main className="flyer-page">
      <Suspense fallback={<section className="flyer-login-shell" />}>
        <FlyerEditorLogin
          defaultNextPath={scholarDataEditorPath}
          title="Scholar data flyer sign in"
        />
      </Suspense>
    </main>
  );
}
