"use client";

import { STYLES, MAX_STYLES } from "@/app/lib/classification";
import { StyleChip } from "@/app/components/ui/style-chip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedStyles: string[];
  onSelectionChange: (styles: string[]) => void;
  className?: string;
}

export function StyleSelector({
  selectedStyles,
  onSelectionChange,
  className,
}: StyleSelectorProps) {
  const handleToggle = (style: string) => {
    if (selectedStyles.includes(style)) {
      onSelectionChange(selectedStyles.filter((s) => s !== style));
    } else if (selectedStyles.length < MAX_STYLES) {
      onSelectionChange([...selectedStyles, style]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>Styles (max {MAX_STYLES})</Label>
        <span className="text-sm text-muted-foreground">
          {selectedStyles.length}/{MAX_STYLES}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((style) => (
          <StyleChip
            key={style}
            style={style}
            selected={selectedStyles.includes(style)}
            onClick={() => handleToggle(style)}
          />
        ))}
      </div>
    </div>
  );
}
