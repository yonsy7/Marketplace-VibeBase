'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterSidebar } from './FilterSidebar';
import { TemplatesGrid } from './TemplatesGrid';
import { ResultsHeader } from './ResultsHeader';
import { EmptyState } from './EmptyState';
import { Pagination } from '@/components/ui/pagination';

export function TemplatesExplorer() {
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
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const updateFilters = (newParams: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
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
    platforms: searchParams.getAll('platform'),
    price: searchParams.get('price'),
    sort: searchParams.get('sort') || 'recent',
    search: searchParams.get('search'),
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-8">
      <aside className="w-64 flex-shrink-0">
        <FilterSidebar filters={activeFilters} onFilterChange={updateFilters} />
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
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', page.toString());
                  router.push(`/templates?${params.toString()}`);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
