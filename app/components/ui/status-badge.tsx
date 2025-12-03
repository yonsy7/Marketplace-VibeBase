import { Badge } from "@/components/ui/badge";
import { TemplateStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TemplateStatus;
  className?: string;
}

const statusConfig: Record<TemplateStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PENDING: { label: "Pending Review", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
