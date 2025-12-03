"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  suggestions = [],
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Tags</Label>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Add tags (press Enter)"
          className="w-full"
        />
        {showSuggestions && filteredSuggestions.length > 0 && inputValue && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleAddTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
