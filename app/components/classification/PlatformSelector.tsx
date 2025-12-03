"use client";

import { PLATFORMS, PLATFORM_DISPLAY_NAMES } from "@/app/lib/classification";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlatformType } from "@prisma/client";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatforms: PlatformType[];
  onSelectionChange: (platforms: PlatformType[]) => void;
  className?: string;
}

export function PlatformSelector({
  selectedPlatforms,
  onSelectionChange,
  className,
}: PlatformSelectorProps) {
  const handleToggle = (platform: PlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      onSelectionChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onSelectionChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label>Compatible AI Platforms</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform);
          return (
            <div
              key={platform}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors",
                isSelected && "bg-accent"
              )}
              onClick={() => handleToggle(platform)}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(platform)}
              />
              <Label className="cursor-pointer text-sm">
                {PLATFORM_DISPLAY_NAMES[platform]}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
