import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.round(rating);
        const halfFilled = starValue - 0.5 <= rating && rating < starValue;

        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : halfFilled
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-muted-foreground'
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
