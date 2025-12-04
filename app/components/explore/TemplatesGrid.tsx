'use client';

import { TemplateCard } from '@/app/components/TemplateCard';

interface TemplatesGridProps {
  templates: any[];
}

export function TemplatesGrid({ templates }: TemplatesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
