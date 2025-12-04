import { Suspense } from 'react';
import { AISearchBox } from './components/home/AISearchBox';
import { StyleChips } from './components/home/StyleChips';
import { CategoryCards } from './components/home/CategoryCards';
import { PlatformBanner } from './components/home/PlatformBanner';
import { PopularTemplates } from './components/home/PopularTemplates';
import { NewArrivals } from './components/home/NewArrivals';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'AI-Ready Design Templates Marketplace',
  description: 'Discover AI-ready design templates for HTML, React, and Next.js. Optimized for v0.dev, Lovable, and more.',
};

function PopularTemplatesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewArrivalsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 space-y-16">
      {/* Hero Section with AI Search */}
      <div className="max-w-4xl mx-auto text-center space-y-6 pt-12">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Find the perfect{' '}
            <span className="text-primary">AI-Ready Template</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover design templates optimized for AI development platforms.
            Compatible with v0.dev, Lovable, Subframe, and more.
          </p>
        </div>

        <div className="pt-8">
          <AISearchBox />
        </div>
      </div>

      {/* Popular Styles */}
      <div>
        <StyleChips />
      </div>

      {/* Categories */}
      <div>
        <CategoryCards categories={[]} />
      </div>

      {/* AI Platforms */}
      <div>
        <PlatformBanner />
      </div>

      {/* Popular Templates */}
      <div>
        <Suspense fallback={<PopularTemplatesSkeleton />}>
          <PopularTemplates />
        </Suspense>
      </div>

      {/* New Arrivals */}
      <div>
        <Suspense fallback={<NewArrivalsSkeleton />}>
          <NewArrivals />
        </Suspense>
      </div>
    </section>
  );
}
