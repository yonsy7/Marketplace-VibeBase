import { cn } from "@/lib/utils";
import { formatPrice } from "@/app/lib/classification";

interface PriceTagProps {
  price: number; // Price in cents
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceTag({ price, size = "md", className }: PriceTagProps) {
  const isFree = price === 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  if (isFree) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 font-semibold",
          sizeClasses[size],
          className
        )}
      >
        Free
      </span>
    );
  }

  return (
    <span
      className={cn("font-bold text-gray-900", sizeClasses[size], className)}
    >
      ${(price / 100).toFixed(2)}
    </span>
  );
}
