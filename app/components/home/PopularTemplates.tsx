import prisma from '@/app/lib/db';
import { TemplateCard } from '@/app/components/TemplateCard';
import { TemplateStatus } from '@prisma/client';

export async function PopularTemplates() {
  // Calculate popularity score: (orders * 10) + (likes * 5) + (views * 1) + (ratingAverage * 20)
  const templates = await prisma.template.findMany({
    where: {
      status: TemplateStatus.PUBLISHED,
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
        },
        take: 3,
      },
      platforms: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
    take: 8,
  });

  // Sort by popularity score
  const sortedTemplates = templates
    .map((template) => ({
      ...template,
      popularityScore:
        template._count.orders * 10 +
        template.likeCount * 5 +
        template.viewCount * 1 +
        template.ratingAverage * 20,
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 8);

  if (sortedTemplates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Popular Templates</h2>
        <a href="/templates?sort=popular" className="text-sm text-primary hover:underline">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
