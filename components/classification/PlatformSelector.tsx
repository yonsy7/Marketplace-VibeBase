'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlatformType } from '@prisma/client';
import { PLATFORMS, getPlatformDisplayName } from '@/app/lib/classification';
import { PlatformIcon } from '@/components/ui/platform-icon';

interface PlatformSelectorProps {
  selected: PlatformType[];
  onChange: (platforms: PlatformType[]) => void;
  disabled?: boolean;
}

const platformIcons: Record<string, string> = {
  V0: 'v0',
  LOVABLE: '💚',
  SUBFRAME: '🔷',
  MAGIC_PATTERNS: '✨',
  UIZARD: '🎨',
  ONLOOK: '👁️',
  REPLIT: '🔵',
  AURA_BUILD: '⚡',
  MAGIC_PATH: '🪄',
  STITCH: '🧵',
};

export function PlatformSelector({ selected, onChange, disabled }: PlatformSelectorProps) {
  const handleToggle = (platform: PlatformType) => {
    if (disabled) return;

    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {PLATFORMS.map((platform) => {
        const isSelected = selected.includes(platform);
        return (
          <div
            key={platform}
            className={`
              flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors
              ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleToggle(platform)}
          >
            <Checkbox
              id={platform}
              checked={isSelected}
              onCheckedChange={() => handleToggle(platform)}
              disabled={disabled}
            />
            <Label htmlFor={platform} className="flex items-center gap-2 cursor-pointer flex-1">
              <PlatformIcon platform={platform} size="sm" />
              <span className="text-sm">{getPlatformDisplayName(platform)}</span>
            </Label>
          </div>
        );
      })}
    </div>
  );
}
