import { Badge } from '@/components/ui/badge';
import { getStyleDisplayName } from '@/app/lib/classification';
import { cn } from '@/lib/utils';

interface StyleChipProps {
  style: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
}

export function StyleChip({ style, variant = 'secondary', className, onClick }: StyleChipProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        'cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {getStyleDisplayName(style)}
    </Badge>
  );
}
