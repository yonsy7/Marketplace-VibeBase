'use client';

import { useState } from 'react';
import { TemplateCard } from '@/app/components/TemplateCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface FavoritesListProps {
  favorites: Array<{
    id: string;
    createdAt: Date;
    template: any;
  }>;
}

export function FavoritesList({ favorites: initialFavorites }: FavoritesListProps) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemove = async (favoriteId: string, templateId: string) => {
    try {
      const response = await fetch(`/api/favorites/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(favorites.filter((f) => f.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
        <p className="text-muted-foreground mb-4">
          Start exploring templates and add them to your favorites
        </p>
        <Button asChild>
          <a href="/templates">Browse Templates</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <div key={favorite.id} className="relative group">
          <TemplateCard template={favorite.template} />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemove(favorite.id, favorite.template.id)}
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
        </div>
      ))}
    </div>
  );
}
