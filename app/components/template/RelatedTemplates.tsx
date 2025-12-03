import { TemplateCard } from '@/app/components/TemplateCard';

interface RelatedTemplatesProps {
  templates: any[];
}

export function RelatedTemplates({ templates }: RelatedTemplatesProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Related Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
