"use client";

import Link from "next/link";
import { PLATFORMS, platformLabels, Platform } from "@/app/lib/classification";
import { PlatformBadge } from "@/components/ui/platform-badge";

interface PlatformIconsProps {
  selectedPlatform?: Platform | null;
  onPlatformClick?: (platform: Platform) => void;
  linkMode?: boolean;
}

export function PlatformIcons({
  selectedPlatform,
  onPlatformClick,
  linkMode = true,
}: PlatformIconsProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">
        AI Design Platforms Compatible
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Our templates work seamlessly with popular AI design tools
      </p>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {PLATFORMS.map((platform) => {
          if (linkMode) {
            return (
              <Link key={platform} href={`/templates?platform=${platform}`}>
                <PlatformBadge
                  platform={platform}
                  size="md"
                  className={
                    selectedPlatform === platform
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }
                />
              </Link>
            );
          }

          return (
            <PlatformBadge
              key={platform}
              platform={platform}
              size="md"
              onClick={() => onPlatformClick?.(platform)}
              className={
                selectedPlatform === platform
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }
            />
          );
        })}
      </div>
    </div>
  );
}
