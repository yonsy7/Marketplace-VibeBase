'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  templateId: string;
  initialLikeCount: number;
  initialIsLiked?: boolean;
  className?: string;
}

export function LikeButton({
  templateId,
  initialLikeCount,
  initialIsLiked = false,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);
    const previousIsLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      if (previousIsLiked) {
        const response = await fetch(`/api/favorites/${templateId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to unlike');
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId }),
        });
        if (!response.ok) throw new Error('Failed to like');
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousCount);
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={cn('gap-2', className)}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          isLiked && 'fill-red-500 text-red-500 animate-pulse'
        )}
      />
      <span>{likeCount}</span>
    </Button>
  );
}
