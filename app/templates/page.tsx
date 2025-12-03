import { Suspense } from 'react';
import { TemplatesExplorer } from '@/app/components/explore/TemplatesExplorer';
import { TemplatesExplorerSkeleton } from '@/app/components/explore/TemplatesExplorerSkeleton';

export const metadata = {
  title: 'Explore Templates | AI-Ready Design Templates',
  description: 'Browse and discover AI-ready design templates for HTML, React, and Next.js',
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Templates</h1>
        <p className="text-muted-foreground">
          Discover AI-ready design templates optimized for modern development
        </p>
      </div>

      <Suspense fallback={<TemplatesExplorerSkeleton />}>
        <TemplatesExplorer />
      </Suspense>
    </div>
  );
}
