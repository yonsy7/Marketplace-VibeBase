'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewCard } from './ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewsListProps {
  templateId: string;
  initialReviews?: any[];
}

export function ReviewsList({ templateId, initialReviews = [] }: ReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?templateId=${templateId}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews();
    }
  }, [templateId, initialReviews.length, fetchReviews]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this template!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
