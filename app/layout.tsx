import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "VibeBase - AI-Ready Design Templates Marketplace",
    template: "%s | VibeBase",
  },
  description:
    "The premier marketplace for AI-ready design templates. Find HTML, React, and Next.js templates optimized for v0.dev, Lovable, and other AI design tools.",
  keywords: [
    "AI templates",
    "v0.dev templates",
    "Lovable templates",
    "Next.js templates",
    "React templates",
    "Tailwind CSS",
    "UI templates",
    "design templates",
    "web templates",
    "marketplace",
  ],
  authors: [{ name: "VibeBase" }],
  creator: "VibeBase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibebase.app",
    siteName: "VibeBase",
    title: "VibeBase - AI-Ready Design Templates Marketplace",
    description:
      "The premier marketplace for AI-ready design templates. Find HTML, React, and Next.js templates optimized for v0.dev, Lovable, and other AI design tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeBase - AI-Ready Design Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeBase - AI-Ready Design Templates Marketplace",
    description:
      "The premier marketplace for AI-ready design templates.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster richColors theme="light" closeButton />
      </body>
    </html>
  );
}
