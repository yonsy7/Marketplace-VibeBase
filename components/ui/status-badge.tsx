import { cn } from "@/lib/utils";
import {
  statusLabels,
  statusColors,
  TemplateStatusType,
} from "@/app/lib/classification";
import { Circle } from "lucide-react";

interface StatusBadgeProps {
  status: TemplateStatusType;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "md",
  showDot = true,
  className,
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const dotColors = {
    DRAFT: "text-gray-500",
    PENDING: "text-yellow-500",
    PUBLISHED: "text-green-500",
    REJECTED: "text-red-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        statusColors[status],
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <Circle className={cn("h-2 w-2 fill-current", dotColors[status])} />
      )}
      {statusLabels[status]}
    </span>
  );
}
