'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { TECH_STACKS, getTechStackDisplayName, PLATFORMS, getPlatformDisplayName } from '@/app/lib/classification';
import { StyleSelector } from '@/app/components/classification/StyleSelector';
import { CategorySelector } from '@/app/components/classification/CategorySelector';
import { SubcategorySelector } from '@/app/components/classification/SubcategorySelector';
import { TagInput } from '@/app/components/classification/TagInput';
import { PlatformSelector } from '@/app/components/classification/PlatformSelector';
import { formatPrice } from '@/app/lib/utils';

interface FilterSidebarProps {
  filters: {
    styles?: string[];
    categories?: string[];
    subcategories?: string[];
    tags?: string[];
    techStack?: string | null;
    platforms?: string[];
    priceMin?: number | null;
    priceMax?: number | null;
    sort?: string;
    search?: string | null;
  };
  onFilterChange: (filters: Record<string, string | string[] | number | null>) => void;
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
  styleTags: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export function FilterSidebar({ filters, onFilterChange, categories, styleTags, tags }: FilterSidebarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin ?? 0,
    filters.priceMax ?? 1000,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: search || null });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    onFilterChange({
      priceMin: values[0],
      priceMax: values[1],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block">Tech Stack</Label>
        <RadioGroup
          value={filters.techStack || ''}
          onValueChange={(value) => onFilterChange({ techStack: value || null })}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-stack" />
              <Label htmlFor="all-stack" className="cursor-pointer">
                All
              </Label>
            </div>
            {TECH_STACKS.map((stack) => (
              <div key={stack} className="flex items-center space-x-2">
                <RadioGroupItem value={stack} id={stack} />
                <Label htmlFor={stack} className="cursor-pointer">
                  {getTechStackDisplayName(stack)}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block">Price Range</Label>
        <div className="space-y-4">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block">Styles</Label>
        <StyleSelector
          selected={filters.styles || []}
          onSelectionChange={(styles) => onFilterChange({ styles })}
          styleTags={styleTags}
        />
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block">Categories</Label>
        <CategorySelector
          selected={filters.categories || []}
          onSelectionChange={(categories) => onFilterChange({ categories })}
          categories={categories}
        />
      </div>

      {filters.categories && filters.categories.length > 0 && (
        <>
          <Separator />
          <div>
            <Label className="mb-3 block">Subcategories</Label>
            <SubcategorySelector
              selected={filters.subcategories || []}
              onSelectionChange={(subcategories) => onFilterChange({ subcategories })}
              categories={categories.filter((c) => filters.categories?.includes(c.id))}
            />
          </div>
        </>
      )}

      <Separator />

      <div>
        <Label className="mb-3 block">Tags</Label>
        <TagInput
          selected={filters.tags || []}
          onSelectionChange={(tags) => onFilterChange({ tags })}
          suggestions={tags}
        />
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block">AI Platforms</Label>
        <PlatformSelector
          selected={filters.platforms || []}
          onSelectionChange={(platforms) => onFilterChange({ platforms })}
        />
      </div>
    </div>
  );
}
