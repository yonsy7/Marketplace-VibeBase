import { Badge } from '@/components/ui/badge';
import { getTechStackDisplayName } from '@/app/lib/classification';
import { TechStack } from '@prisma/client';
import { cn } from '@/lib/utils';

interface TechStackBadgeProps {
  techStack: TechStack | string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

const techStackIcons: Record<string, string> = {
  HTML: '🌐',
  REACT_VITE: '⚛️',
  NEXTJS: '▲',
};

export function TechStackBadge({ techStack, variant = 'default', className }: TechStackBadgeProps) {
  const displayName = getTechStackDisplayName(techStack);
  const icon = techStackIcons[techStack] || '📦';

  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      <span>{icon}</span>
      <span>{displayName}</span>
    </Badge>
  );
}
