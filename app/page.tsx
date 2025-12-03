import { AISearchBox } from "./components/home/AISearchBox";
import { StyleChips } from "./components/home/StyleChips";
import { CategoryCards } from "./components/home/CategoryCards";
import { PlatformBanner } from "./components/home/PlatformBanner";
import { PopularTemplates } from "./components/home/PopularTemplates";
import { NewArrivals } from "./components/home/NewArrivals";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      {/* Hero Section with AI Search */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Find the best AI-Ready
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
          Design Templates
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover premium templates optimized for v0.dev, Lovable, and other AI platforms.
          HTML, React, and Next.js templates ready to use.
        </p>
        <div className="max-w-2xl mx-auto">
          <AISearchBox />
        </div>
      </div>

      {/* Popular Styles */}
      <div className="mb-16">
        <StyleChips />
      </div>

      {/* Categories */}
      <div className="mb-16">
        <CategoryCards />
      </div>

      {/* Platform Banner */}
      <div className="mb-16">
        <PlatformBanner />
      </div>

      {/* Popular Templates */}
      <div className="mb-16">
        <PopularTemplates />
      </div>

      {/* New Arrivals */}
      <div className="mb-16">
        <NewArrivals />
      </div>
    </section>
  );
}
