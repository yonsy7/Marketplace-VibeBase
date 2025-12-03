"use client";

import { CATEGORIES, MAX_CATEGORIES } from "@/app/lib/classification";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
  className?: string;
}

export function CategorySelector({
  selectedCategories,
  onSelectionChange,
  className,
}: CategorySelectorProps) {
  const handleToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onSelectionChange(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < MAX_CATEGORIES) {
      onSelectionChange([...selectedCategories, category]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>Categories (max {MAX_CATEGORIES})</Label>
        <span className="text-sm text-muted-foreground">
          {selectedCategories.length}/{MAX_CATEGORIES}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Card
              key={category}
              className={cn(
                "cursor-pointer transition-colors",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => handleToggle(category)}
            >
              <CardContent className="flex items-center space-x-2 p-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggle(category)}
                />
                <Label className="cursor-pointer flex-1">{category}</Label>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
