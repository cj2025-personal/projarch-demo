import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { conceptOneLiner } from "./content/platformContent";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Project Arch | AI Learning Concept",
  description: conceptOneLiner,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className}`}>{children}</body>
    </html>
  );
}
