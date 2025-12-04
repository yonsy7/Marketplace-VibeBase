'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingInput } from '@/app/components/ui/RatingInput';
import { toast } from 'sonner';

interface ReviewFormProps {
  templateId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  };
  onSuccess?: () => void;
}

export function ReviewForm({ templateId, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      toast.success(existingReview ? 'Review updated!' : 'Review submitted!');
      setComment('');
      setRating(0);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating *</Label>
        <RatingInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment (Optional)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this template..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  );
}
