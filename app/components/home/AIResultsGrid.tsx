'use client';

import { TemplateCard } from '@/app/components/TemplateCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AIResultsGridProps {
  results: Array<{
    id: string;
    slug: string;
    title: string;
    byline?: string;
    shortDesc: string;
    price: number;
    techStack: string;
    previewImages?: any;
    ratingAverage: number;
    ratingCount: number;
    likeCount: number;
    styles?: Array<{ styleTag: { name: string } }>;
    platforms?: Array<{ platform: string }>;
    score?: number;
    explanation?: string;
  }>;
}

export function AIResultsGrid({ results }: AIResultsGridProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">AI Suggestions</h2>
        <Badge variant="secondary">{results.length} matches</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((template, index) => (
          <div key={template.id} className="relative">
            <TemplateCard template={template} />
            {template.score && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary/90">
                  {Math.round(template.score * 100)}% match
                </Badge>
              </div>
            )}
            {template.explanation && (
              <Card className="mt-2">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{template.explanation}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
