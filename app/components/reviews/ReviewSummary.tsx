'use client';

import { useState, useEffect } from 'react';
import { RatingStars } from '@/components/ui/RatingStars';
import { Progress } from '@/components/ui/progress';

interface ReviewSummaryProps {
  templateId: string;
}

export function ReviewSummary({ templateId }: ReviewSummaryProps) {
  const [summary, setSummary] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    fetchSummary();
  }, [templateId]);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api/reviews?templateId=${templateId}`);
      const data = await response.json();
      const reviews = data.reviews || [];

      const total = reviews.length;
      const average = total > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 0;
      
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach((review: any) => {
        distribution[review.rating as keyof typeof distribution]++;
      });

      setSummary({ average, total, distribution });
    } catch (error) {
      console.error('Error fetching review summary:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{summary.average.toFixed(1)}</div>
        <div>
          <RatingStars rating={summary.average} size="lg" />
          <p className="text-sm text-muted-foreground mt-1">
            {summary.total} {summary.total === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {summary.total > 0 && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = summary.distribution[rating as keyof typeof summary.distribution];
            const percentage = (count / summary.total) * 100;

            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{rating}★</span>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
