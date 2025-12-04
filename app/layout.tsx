import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "./components/layout/Footer";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default: "MarshalUI - AI-Ready Design Templates",
    template: "%s | MarshalUI",
  },
  description: "Discover premium AI-ready design templates for HTML, React, and Next.js. Optimized for modern development workflows.",
  keywords: ["design templates", "React templates", "Next.js templates", "AI-ready", "UI templates", "web design"],
  authors: [{ name: "MarshalUI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marshal-ui-yt.vercel.app",
    siteName: "MarshalUI",
    title: "MarshalUI - AI-Ready Design Templates",
    description: "Discover premium AI-ready design templates for HTML, React, and Next.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarshalUI - AI-Ready Design Templates",
    description: "Discover premium AI-ready design templates for HTML, React, and Next.js.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
