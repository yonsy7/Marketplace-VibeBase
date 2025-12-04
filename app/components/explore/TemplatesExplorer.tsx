'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterSidebar } from './FilterSidebar';
import { TemplatesGrid } from './TemplatesGrid';
import { ResultsHeader } from './ResultsHeader';
import { EmptyState } from './EmptyState';
import { PlatformType } from '@prisma/client';

interface TemplatesExplorerProps {
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
  styleTags: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export function TemplatesExplorer({ categories, styleTags, tags }: TemplatesExplorerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/templates?${params.toString()}`);
      const data = await response.json();
      setTemplates(data.templates || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 24,
        total: 0,
        totalPages: 0,
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const updateFilters = (newParams: Record<string, string | string[] | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, String(value));
      }
    });

    params.delete('page'); // Reset to page 1 when filters change
    router.push(`/templates?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/templates');
  };

  const activeFilters = {
    styles: searchParams.getAll('style'),
    categories: searchParams.getAll('category'),
    subcategories: searchParams.getAll('subcategory'),
    tags: searchParams.getAll('tag'),
    techStack: searchParams.get('techStack'),
    platforms: searchParams.getAll('platform') as PlatformType[],
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : null,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : null,
    sort: searchParams.get('sort') || 'recent',
    search: searchParams.get('search'),
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-8">
      <aside className="w-64 flex-shrink-0">
        <FilterSidebar
          filters={activeFilters}
          onFilterChange={updateFilters}
          categories={categories}
          styleTags={styleTags}
          tags={tags}
        />
      </aside>

      <main className="flex-1 space-y-6">
        <ResultsHeader
          total={pagination.total}
          filters={activeFilters}
          onClearFilters={clearFilters}
        />

        {templates.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <>
            <TemplatesGrid templates={templates} />
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => {
                    if (pagination.page > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', (pagination.page - 1).toString());
                      router.push(`/templates?${params.toString()}`);
                    }
                  }}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => {
                    if (pagination.page < pagination.totalPages) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', (pagination.page + 1).toString());
                      router.push(`/templates?${params.toString()}`);
                    }
                  }}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
