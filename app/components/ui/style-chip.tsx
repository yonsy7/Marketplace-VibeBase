import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StyleChipProps {
  style: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function StyleChip({ style, onClick, selected, className }: StyleChipProps) {
  return (
    <Badge
      variant={selected ? "default" : "outline"}
      className={cn(
        "cursor-pointer transition-colors",
        selected && "bg-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
    >
      {style}
    </Badge>
  );
}
