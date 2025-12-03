import { Suspense } from "react";
import Link from "next/link";
import prisma from "./lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StyleChips } from "./components/StyleChips";
import { CategoryCards } from "./components/CategoryCards";
import { PlatformIcons } from "./components/PlatformIcons";
import { TemplateCard } from "./components/TemplateCard";
import { TemplateGridSkeleton } from "./components/TemplateCardSkeleton";
import { ProductRow } from "./components/ProductRow";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Style, TechStackType } from "./lib/classification";

async function getPopularTemplates() {
  noStore();
  
  const templates = await prisma.template.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { viewCount: "desc" },
      { likeCount: "desc" },
      { ratingAverage: "desc" },
    ],
    take: 6,
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          style: true,
        },
      },
    },
  });

  return templates;
}

async function getNewestTemplates() {
  noStore();
  
  const templates = await prisma.template.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          style: true,
        },
      },
    },
  });

  return templates;
}

async function PopularTemplatesSection() {
  const templates = await getPopularTemplates();

  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Popular Templates</h2>
        <Link href="/templates?sort=popular">
          <Button variant="ghost">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            slug={template.slug}
            title={template.title}
            shortDesc={template.shortDesc}
            price={template.price}
            images={
              template.previewImages
                ? (template.previewImages as string[])
                : []
            }
            styles={template.styles.map((s) => s.style.slug as Style)}
            techStack={template.techStack as TechStackType}
            ratingAverage={template.ratingAverage}
            ratingCount={template.ratingCount}
            likeCount={template.likeCount}
            viewCount={template.viewCount}
            creatorName={`${template.creator.firstName} ${template.creator.lastName}`}
            creatorImage={template.creator.profileImage}
          />
        ))}
      </div>
    </section>
  );
}

async function NewestTemplatesSection() {
  const templates = await getNewestTemplates();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <Link href="/templates?sort=newest">
          <Button variant="ghost">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            slug={template.slug}
            title={template.title}
            shortDesc={template.shortDesc}
            price={template.price}
            images={
              template.previewImages
                ? (template.previewImages as string[])
                : []
            }
            styles={template.styles.map((s) => s.style.slug as Style)}
            techStack={template.techStack as TechStackType}
            ratingAverage={template.ratingAverage}
            ratingCount={template.ratingCount}
            likeCount={template.likeCount}
            viewCount={template.viewCount}
            creatorName={`${template.creator.firstName} ${template.creator.lastName}`}
            creatorImage={template.creator.profileImage}
            isNew={new Date(template.createdAt) > sevenDaysAgo}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Ready Design Templates
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Find the Perfect Template for Your
          <span className="text-primary block mt-2">Next AI Project</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          VibeBase is the premier marketplace for AI-ready design templates. 
          Discover HTML, React, and Next.js templates optimized for v0.dev, 
          Lovable, and other AI design tools.
        </p>
        
        {/* Search CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/templates">
            <Button size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Explore Templates
            </Button>
          </Link>
          <Link href="/sell">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Cards */}
      <div className="mt-8">
        <CategoryCards />
      </div>

      <Separator className="my-12" />

      {/* Styles Section */}
      <StyleChips />

      <Separator className="my-12" />

      {/* AI Platforms Section */}
      <PlatformIcons />

      {/* Popular Templates */}
      <Suspense fallback={<TemplateGridSkeleton count={6} />}>
        <PopularTemplatesSection />
      </Suspense>

      {/* New Arrivals */}
      <Suspense fallback={<TemplateGridSkeleton count={6} />}>
        <NewestTemplatesSection />
      </Suspense>

      {/* Legacy Product Rows - for backward compatibility */}
      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Classic Marketplace</h2>
        <ProductRow category="newest" />
        <ProductRow category="templates" />
        <ProductRow category="icons" />
        <ProductRow category="uikits" />
      </div>
    </section>
  );
}
