import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  showCount = false,
  count = 0,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.floor(roundedRating);
          const isHalf =
            starValue === Math.ceil(roundedRating) && roundedRating % 1 !== 0;

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                isFilled || isHalf
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span
          className={cn("font-medium text-gray-700", textSizeClasses[size])}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && count > 0 && (
        <span className={cn("text-gray-500", textSizeClasses[size])}>
          ({count})
        </span>
      )}
    </div>
  );
}
