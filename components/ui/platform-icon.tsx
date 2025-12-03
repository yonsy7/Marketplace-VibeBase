import { PlatformType } from '@prisma/client';
import { getPlatformDisplayName } from '@/app/lib/classification';
import { cn } from '@/lib/utils';

interface PlatformIconProps {
  platform: PlatformType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
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

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function PlatformIcon({ platform, size = 'md', className, showLabel = false }: PlatformIconProps) {
  const icon = platformIcons[platform] || '📦';
  const label = getPlatformDisplayName(platform);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-md bg-muted p-1',
          sizeClasses[size]
        )}
        title={label}
      >
        {icon}
      </div>
      {showLabel && <span className="text-sm">{label}</span>}
    </div>
  );
}
