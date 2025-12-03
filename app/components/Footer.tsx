import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <h3 className="text-xl font-bold">
                Vibe<span className="text-primary">Base</span>
              </h3>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The premier marketplace for AI-ready design templates. 
              Find templates optimized for v0.dev, Lovable, and more.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/templates"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/templates?category=marketing-landing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Marketing & Landing
                </Link>
              </li>
              <li>
                <Link
                  href="/templates?category=product-app-ui"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Product & App UI
                </Link>
              </li>
              <li>
                <Link
                  href="/templates?category=dashboard-analytics"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard & Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sell"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/billing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Billing & Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VibeBase. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Compatible with:</span>
            <span className="font-medium">v0.dev</span>
            <span>•</span>
            <span className="font-medium">Lovable</span>
            <span>•</span>
            <span className="font-medium">Subframe</span>
            <span>•</span>
            <span className="font-medium">Magic Patterns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
