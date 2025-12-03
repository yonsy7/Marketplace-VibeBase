"use client";

import { SUBCATEGORIES, MAX_SUBCATEGORIES } from "@/app/lib/classification";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SubcategorySelectorProps {
  selectedCategories: string[];
  selectedSubcategories: string[];
  onSelectionChange: (subcategories: string[]) => void;
  className?: string;
}

export function SubcategorySelector({
  selectedCategories,
  selectedSubcategories,
  onSelectionChange,
  className,
}: SubcategorySelectorProps) {
  // Get subcategories for selected categories only
  const availableSubcategories = selectedCategories.flatMap(
    (category) => SUBCATEGORIES[category as keyof typeof SUBCATEGORIES] || []
  );

  const handleToggle = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      onSelectionChange(selectedSubcategories.filter((s) => s !== subcategory));
    } else if (selectedSubcategories.length < MAX_SUBCATEGORIES) {
      onSelectionChange([...selectedSubcategories, subcategory]);
    }
  };

  if (selectedCategories.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Select categories first to choose subcategories
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>Subcategories (max {MAX_SUBCATEGORIES})</Label>
        <span className="text-sm text-muted-foreground">
          {selectedSubcategories.length}/{MAX_SUBCATEGORIES}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableSubcategories.map((subcategory) => {
          const isSelected = selectedSubcategories.includes(subcategory);
          return (
            <div
              key={subcategory}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors",
                isSelected && "bg-accent"
              )}
              onClick={() => handleToggle(subcategory)}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(subcategory)}
              />
              <Label className="cursor-pointer text-sm">{subcategory}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
