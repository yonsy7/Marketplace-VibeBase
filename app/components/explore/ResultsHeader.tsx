'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResultsHeaderProps {
  total: number;
  filters: {
    styles?: string[];
    categories?: string[];
    subcategories?: string[];
    tags?: string[];
    techStack?: string | null;
    platforms?: string[];
    price?: string | null;
    sort?: string;
    search?: string | null;
  };
  onClearFilters: () => void;
  onSortChange?: (sort: string) => void;
}

export function ResultsHeader({ total, filters, onClearFilters, onSortChange }: ResultsHeaderProps) {
  const hasActiveFilters =
    (filters.styles && filters.styles.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.subcategories && filters.subcategories.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    filters.techStack ||
    (filters.platforms && filters.platforms.length > 0) ||
    filters.price ||
    filters.search;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'template' : 'templates'} found
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <Select
        value={filters.sort || 'recent'}
        onValueChange={onSortChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="likes">Most Liked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
