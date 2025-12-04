import { TemplatesExplorerSkeleton } from '@/app/components/explore/TemplatesExplorerSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-64 bg-muted rounded animate-pulse mb-2" />
        <div className="h-6 w-96 bg-muted rounded animate-pulse" />
      </div>
      <TemplatesExplorerSkeleton />
    </div>
  );
}
