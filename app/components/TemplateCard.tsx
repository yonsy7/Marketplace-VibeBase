'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechStackBadge } from '@/components/ui/tech-stack-badge';
import { StyleChip } from '@/components/ui/style-chip';
import { Star, Heart } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';

interface TemplateCardProps {
  template: {
    id: string;
    slug: string;
    title: string;
    byline?: string | null;
    shortDesc: string;
    price: number;
    techStack: string;
    previewImages?: any;
    ratingAverage: number;
    ratingCount: number;
    likeCount: number;
    styles?: Array<{ styleTag: { name: string } }>;
    platforms?: Array<{ platform: string }>;
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  const previewImage =
    template.previewImages &&
    typeof template.previewImages === 'object' &&
    'images' in template.previewImages
      ? (template.previewImages as any).images?.[0]
      : null;

  return (
    <Link href={`/templates/${template.slug}`}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={template.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No preview</span>
            </div>
          )}
          {template.price === 0 && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Free
            </Badge>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{template.title}</h3>
            {template.byline && (
              <p className="text-sm text-muted-foreground line-clamp-1">{template.byline}</p>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {template.shortDesc}
          </p>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <TechStackBadge techStack={template.techStack} variant="outline" />
            {template.styles && template.styles.length > 0 && (
              <StyleChip style={template.styles[0].styleTag.name} variant="outline" />
            )}
            {template.styles && template.styles.length > 1 && (
              <Badge variant="outline" className="text-xs">
                +{template.styles.length - 1}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t">
            <div className="flex items-center gap-4 text-sm">
              {template.ratingCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{template.ratingAverage.toFixed(1)}</span>
                  <span className="text-muted-foreground">({template.ratingCount})</span>
                </div>
              )}
              {template.likeCount > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{template.likeCount}</span>
                </div>
              )}
            </div>
            <div className="font-semibold">
              {template.price === 0 ? 'Free' : formatPrice(template.price)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
