'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_CATEGORIES } from '@/app/lib/classification';
import prisma from '@/app/lib/db';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface CategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
  categories: Category[];
  disabled?: boolean;
}

export function CategorySelector({ selected, onChange, categories, disabled }: CategorySelectorProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(selected);

  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  const handleToggle = (categoryId: string) => {
    if (disabled) return;

    let newSelected: string[];
    if (internalSelected.includes(categoryId)) {
      newSelected = internalSelected.filter((id) => id !== categoryId);
    } else {
      if (internalSelected.length >= MAX_CATEGORIES) {
        return; // Max reached
      }
      newSelected = [...internalSelected, categoryId];
    }

    setInternalSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Categories</label>
        <span className="text-xs text-muted-foreground">
          {internalSelected.length}/{MAX_CATEGORIES} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = internalSelected.includes(category.id);
          return (
            <Card
              key={category.id}
              className={`
                cursor-pointer transition-all hover:border-primary
                ${isSelected ? 'border-primary bg-primary/5' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => handleToggle(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={category.id}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(category.id)}
                    disabled={disabled}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {category.icon && <span className="text-2xl">{category.icon}</span>}
                      <Label htmlFor={category.id} className="font-semibold cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
