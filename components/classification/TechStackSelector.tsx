'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TechStack } from '@prisma/client';
import { TECH_STACKS, getTechStackDisplayName } from '@/app/lib/classification';

interface TechStackSelectorProps {
  value?: TechStack;
  onChange: (value: TechStack) => void;
  disabled?: boolean;
}

const techStackIcons: Record<string, string> = {
  HTML: '🌐',
  REACT_VITE: '⚛️',
  NEXTJS: '▲',
};

export function TechStackSelector({ value, onChange, disabled }: TechStackSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
      <div className="flex flex-col gap-4">
        {TECH_STACKS.map((stack) => (
          <div key={stack} className="flex items-center space-x-2">
            <RadioGroupItem value={stack} id={stack} />
            <Label htmlFor={stack} className="flex items-center gap-2 cursor-pointer">
              <span className="text-lg">{techStackIcons[stack]}</span>
              <span>{getTechStackDisplayName(stack)}</span>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
