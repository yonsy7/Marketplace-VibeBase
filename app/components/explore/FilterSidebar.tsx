'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { TECH_STACKS, getTechStackDisplayName } from '@/app/lib/classification';

interface FilterSidebarProps {
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
  onFilterChange: (filters: Record<string, string | string[] | null>) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: search || null });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

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
        <Label className="mb-3 block">Price</Label>
        <RadioGroup
          value={filters.price || ''}
          onValueChange={(value) => onFilterChange({ price: value || null })}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-price" />
              <Label htmlFor="all-price" className="cursor-pointer">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free" className="cursor-pointer">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" />
              <Label htmlFor="paid" className="cursor-pointer">
                Paid
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
