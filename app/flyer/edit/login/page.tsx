import { Suspense } from "react";
import type { Metadata } from "next";
import { FlyerEditorLogin } from "../../../components/FlyerEditorLogin";
import "../../flyer-page.css";

export const metadata: Metadata = {
  title: "Flyer Editor Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FlyerEditorLoginPage() {
  return (
    <main className="flyer-page">
      <Suspense fallback={<section className="flyer-login-shell" />}>
        <FlyerEditorLogin />
      </Suspense>
    </main>
  );
}
