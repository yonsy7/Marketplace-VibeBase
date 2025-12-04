'use client';

import { useState } from 'react';
import { TemplateCard } from '@/app/components/TemplateCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CreatorTemplatesProps {
  templates: any[];
}

export function CreatorTemplates({ templates: initialTemplates }: CreatorTemplatesProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');

  // Filter and sort templates
  const filteredTemplates = templates
    .filter((template) => {
      if (!search) return true;
      const query = search.toLowerCase();
      return (
        template.title.toLowerCase().includes(query) ||
        template.shortDesc.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return (b._count.orders + b.likeCount) - (a._count.orders + a.likeCount);
        case 'rating':
          return b.ratingAverage - a.ratingAverage;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No templates published yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No templates match your search.
        </div>
      )}
    </div>
  );
}
