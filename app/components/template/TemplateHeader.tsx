import Link from 'next/link';
import { TechStackBadge } from '@/components/ui/tech-stack-badge';
import { StyleChip } from '@/components/ui/style-chip';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';

interface TemplateHeaderProps {
  template: {
    id: string;
    title: string;
    byline?: string;
    price: number;
    techStack: string;
    ratingAverage: number;
    ratingCount: number;
    likeCount: number;
    styles: Array<{ styleTag: { name: string } }>;
    categories: Array<{ category: { name: string; icon?: string } }>;
    subcategories: Array<{ subcategory: { name: string } }>;
    tags: Array<{ tag: { name: string } }>;
    platforms: Array<{ platform: string }>;
    creator: {
      username?: string;
      firstName: string;
      lastName: string;
    };
  };
}

export function TemplateHeader({ template }: TemplateHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
        {template.byline && (
          <p className="text-xl text-muted-foreground">{template.byline}</p>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-2xl font-bold">
          {template.price === 0 ? 'Free' : formatPrice(template.price)}
        </div>
        {template.price === 0 && <Badge variant="secondary">Free</Badge>}

        {template.ratingCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{template.ratingAverage.toFixed(1)}</span>
            <span className="text-muted-foreground">({template.ratingCount})</span>
          </div>
        )}

        {template.likeCount > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-5 w-5" />
            <span>{template.likeCount} favorites</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TechStackBadge techStack={template.techStack} />
        {template.styles.map((style) => (
          <StyleChip key={style.styleTag.name} style={style.styleTag.name} />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {template.categories.map((cat) => (
          <Badge key={cat.category.name} variant="outline">
            {cat.category.icon} {cat.category.name}
          </Badge>
        ))}
        {template.subcategories.map((sub) => (
          <Badge key={sub.subcategory.name} variant="outline" className="text-xs">
            {sub.subcategory.name}
          </Badge>
        ))}
      </div>

      {template.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {template.tags.map((tag) => (
            <Badge key={tag.tag.name} variant="secondary" className="text-xs">
              {tag.tag.name}
            </Badge>
          ))}
        </div>
      )}

      {template.platforms.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Compatible with:</span>
          <div className="flex items-center gap-2">
            {template.platforms.map((p) => (
              <PlatformIcon key={p.platform} platform={p.platform} size="sm" />
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Created by{' '}
          {template.creator.username ? (
            <Link
              href={`/creator/${template.creator.username}`}
              className="font-medium text-foreground hover:underline"
            >
              {template.creator.firstName} {template.creator.lastName}
            </Link>
          ) : (
            <span className="font-medium">
              {template.creator.firstName} {template.creator.lastName}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
