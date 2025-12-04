'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { AIResultsGrid } from './AIResultsGrid';

export function AISearchBox() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/ai/suggest-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setResults(data.templates || []);
    } catch (err) {
      setError('Unable to find templates. Please try again.');
      console.error('AI search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Décris ton besoin : 'Landing SaaS dark en Next.js', 'Dashboard analytics moderne', 'Template e-commerce React'..."
          className="min-h-[120px] text-lg pr-12 resize-none"
        />
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          size="icon"
          className="absolute bottom-4 right-4"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <AIResultsGrid results={results} />
      )}

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Finding your perfect templates...</p>
        </div>
      )}
    </div>
  );
}
