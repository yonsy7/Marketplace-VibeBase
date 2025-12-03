'use client';

import { useState, useEffect } from 'react';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { STYLES, MAX_STYLES, getStyleDisplayName } from '@/app/lib/classification';
import { StyleChip } from '@/components/ui/style-chip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StyleSelectorProps {
  selected: string[];
  onChange: (styles: string[]) => void;
  disabled?: boolean;
}

export function StyleSelector({ selected, onChange, disabled }: StyleSelectorProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(selected);

  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  const handleChange = (newSelected: string[]) => {
    if (newSelected.length <= MAX_STYLES) {
      setInternalSelected(newSelected);
      onChange(newSelected);
    }
  };

  const options: MultiSelectOption[] = STYLES.map((style) => ({
    value: style,
    label: getStyleDisplayName(style),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Styles</label>
        <span className="text-xs text-muted-foreground">
          {internalSelected.length}/{MAX_STYLES} selected
        </span>
      </div>

      <MultiSelect
        options={options}
        selected={internalSelected}
        onChange={handleChange}
        placeholder="Select styles..."
        searchPlaceholder="Search styles..."
        emptyMessage="No styles found."
        maxCount={MAX_STYLES}
        disabled={disabled}
      />

      {internalSelected.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selected styles:</label>
          <ScrollArea className="w-full">
            <div className="flex flex-wrap gap-2">
              {internalSelected.map((style) => (
                <StyleChip
                  key={style}
                  style={style}
                  onClick={() => {
                    if (!disabled) {
                      handleChange(internalSelected.filter((s) => s !== style));
                    }
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
