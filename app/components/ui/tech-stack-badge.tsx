import { Badge } from "@/components/ui/badge";
import { TECH_STACK_DISPLAY_NAMES, TechStack } from "@/app/lib/classification";

interface TechStackBadgeProps {
  techStack: TechStack;
  className?: string;
}

export function TechStackBadge({ techStack, className }: TechStackBadgeProps) {
  return (
    <Badge variant="secondary" className={className}>
      {TECH_STACK_DISPLAY_NAMES[techStack]}
    </Badge>
  );
}
