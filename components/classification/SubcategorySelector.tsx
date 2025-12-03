'use client';

import { useState, useEffect, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MAX_SUBCATEGORIES } from '@/app/lib/classification';

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

interface SubcategorySelectorProps {
  selected: string[];
  onChange: (subcategories: string[]) => void;
  subcategories: Subcategory[];
  selectedCategories: string[];
  disabled?: boolean;
}

export function SubcategorySelector({
  selected,
  onChange,
  subcategories,
  selectedCategories,
  disabled,
}: SubcategorySelectorProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(selected);

  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  // Filter subcategories by selected categories
  const availableSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) {
      return [];
    }
    return subcategories.filter((sub) => selectedCategories.includes(sub.categoryId));
  }, [subcategories, selectedCategories]);

  // Group by category
  const groupedSubcategories = useMemo(() => {
    const groups: Record<string, Subcategory[]> = {};
    availableSubcategories.forEach((sub) => {
      if (!groups[sub.categoryId]) {
        groups[sub.categoryId] = [];
      }
      groups[sub.categoryId].push(sub);
    });
    return groups;
  }, [availableSubcategories]);

  const handleToggle = (subcategoryId: string) => {
    if (disabled) return;

    let newSelected: string[];
    if (internalSelected.includes(subcategoryId)) {
      newSelected = internalSelected.filter((id) => id !== subcategoryId);
    } else {
      if (internalSelected.length >= MAX_SUBCATEGORIES) {
        return; // Max reached
      }
      newSelected = [...internalSelected, subcategoryId];
    }

    setInternalSelected(newSelected);
    onChange(newSelected);
  };

  if (selectedCategories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Please select at least one category first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Subcategories</label>
        <span className="text-xs text-muted-foreground">
          {internalSelected.length}/{MAX_SUBCATEGORIES} selected
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedSubcategories).map(([categoryId, subs]) => (
          <div key={categoryId} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {subs[0]?.categoryId || 'Subcategories'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subs.map((sub) => {
                const isSelected = internalSelected.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    className={`
                      flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors
                      ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => handleToggle(sub.id)}
                  >
                    <Checkbox
                      id={sub.id}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(sub.id)}
                      disabled={disabled}
                    />
                    <Label htmlFor={sub.id} className="text-sm cursor-pointer flex-1">
                      {sub.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
