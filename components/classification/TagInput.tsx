'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  suggestions?: Tag[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  selected,
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  maxTags = 20,
  disabled,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (tag) =>
      !selected.includes(tag.id) &&
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddTag = (tagId: string) => {
    if (selected.length >= maxTags) return;
    if (!selected.includes(tagId)) {
      onChange([...selected, tagId]);
      setInputValue('');
      setOpen(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selected.filter((id) => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // Check if it matches a suggestion
      const matchingSuggestion = filteredSuggestions.find(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (matchingSuggestion) {
        handleAddTag(matchingSuggestion.id);
      } else {
        // Create new tag (would need API call in real implementation)
        // For now, just add the text as-is
        if (selected.length < maxTags) {
          // This would typically create a new tag via API
          console.log('Would create new tag:', inputValue);
        }
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && selected.length > 0) {
      handleRemoveTag(selected[selected.length - 1]);
    }
  };

  const selectedTags = suggestions.filter((tag) => selected.includes(tag.id));

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Tags</label>
        <span className="text-xs text-muted-foreground">
          {selected.length}/{maxTags} tags
        </span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1"
            />
          </div>
        </PopoverTrigger>
        {filteredSuggestions.length > 0 && (
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput value={inputValue} onValueChange={setInputValue} />
              <CommandList>
                <CommandEmpty>No tags found. Press Enter to create.</CommandEmpty>
                <CommandGroup>
                  {filteredSuggestions.slice(0, 10).map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleAddTag(tag.id)}
                    >
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="gap-1">
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                disabled={disabled}
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
