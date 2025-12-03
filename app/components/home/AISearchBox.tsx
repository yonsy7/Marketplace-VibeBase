"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface AISearchBoxProps {
  onSearch?: (query: string) => void;
}

export function AISearchBox({ onSearch }: AISearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      if (onSearch) {
        await onSearch(query);
      }
      // TODO: Implement AI search API call
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Textarea
        placeholder="Décris ton besoin : 'Landing SaaS dark en Next.js'..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-[100px] text-lg"
        disabled={isLoading}
      />
      <Button type="submit" size="lg" className="w-full" disabled={isLoading || !query.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recherche en cours...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Trouver mes templates
          </>
        )}
      </Button>
    </form>
  );
}
