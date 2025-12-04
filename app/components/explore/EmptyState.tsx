'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No templates found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters or search terms
      </p>
      <Button onClick={onClearFilters} variant="outline">
        Clear all filters
      </Button>
    </div>
  );
}
