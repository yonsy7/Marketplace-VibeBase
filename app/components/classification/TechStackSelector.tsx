"use client";

import { TECH_STACKS, TECH_STACK_DISPLAY_NAMES } from "@/app/lib/classification";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TechStack } from "@prisma/client";

interface TechStackSelectorProps {
  selectedTechStack: TechStack | null;
  onSelectionChange: (techStack: TechStack) => void;
  className?: string;
}

export function TechStackSelector({
  selectedTechStack,
  onSelectionChange,
  className,
}: TechStackSelectorProps) {
  return (
    <div className={className}>
      <Label className="mb-3 block">Tech Stack</Label>
      <RadioGroup
        value={selectedTechStack || undefined}
        onValueChange={(value) => onSelectionChange(value as TechStack)}
      >
        {TECH_STACKS.map((stack) => (
          <div key={stack} className="flex items-center space-x-2">
            <RadioGroupItem value={stack} id={stack} />
            <Label htmlFor={stack} className="cursor-pointer">
              {TECH_STACK_DISPLAY_NAMES[stack]}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
