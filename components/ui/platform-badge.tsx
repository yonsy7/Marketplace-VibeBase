import { cn } from "@/lib/utils";
import { platformLabels, Platform } from "@/app/lib/classification";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const platformColors: Record<Platform, string> = {
  V0: "bg-black text-white hover:bg-gray-800",
  LOVABLE: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  SUBFRAME: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  MAGIC_PATTERNS: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  UIZARD: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  ONLOOK: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  REPLIT: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  AURA_BUILD: "bg-violet-100 text-violet-800 hover:bg-violet-200",
  MAGIC_PATH: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  STITCH: "bg-teal-100 text-teal-800 hover:bg-teal-200",
};

export function PlatformBadge({
  platform,
  size = "md",
  className,
  onClick,
}: PlatformBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium transition-colors",
        platformColors[platform],
        sizeClasses[size],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {platformLabels[platform]}
    </span>
  );
}
