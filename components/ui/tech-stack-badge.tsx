import { cn } from "@/lib/utils";
import {
  techStackLabels,
  techStackIcons,
  techStackColors,
  TechStackType,
} from "@/app/lib/classification";

interface TechStackBadgeProps {
  techStack: TechStackType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function TechStackBadge({
  techStack,
  size = "md",
  showIcon = true,
  className,
}: TechStackBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium border",
        techStackColors[techStack],
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span>{techStackIcons[techStack]}</span>}
      {techStackLabels[techStack]}
    </span>
  );
}
