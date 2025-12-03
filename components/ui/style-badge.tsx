import { cn } from "@/lib/utils";
import { styleLabels, styleColors, Style } from "@/app/lib/classification";

interface StyleBadgeProps {
  style: Style;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function StyleBadge({
  style,
  size = "md",
  className,
  onClick,
}: StyleBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-colors",
        styleColors[style],
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClick}
    >
      {styleLabels[style]}
    </span>
  );
}
