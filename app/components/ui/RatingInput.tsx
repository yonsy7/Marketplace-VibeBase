'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  disabled?: boolean;
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  maxRating = 5,
  disabled,
  className,
}: RatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoveredRating || value);

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => !disabled && setHoveredRating(starValue)}
            onMouseLeave={() => !disabled && setHoveredRating(0)}
            className={cn(
              'transition-colors',
              !disabled && 'cursor-pointer hover:scale-110'
            )}
          >
            <Star
              className={cn(
                'h-6 w-6',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} / {maxRating}
        </span>
      )}
    </div>
  );
}
