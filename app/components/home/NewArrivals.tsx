import prisma from '@/app/lib/db';
import { TemplateCard } from '@/app/components/TemplateCard';
import { TemplateStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';

export async function NewArrivals() {
  const templates = await prisma.template.findMany({
    where: {
      status: TemplateStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: 'desc',
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

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">New Arrivals</h2>
        <a href="/templates?sort=recent" className="text-sm text-primary hover:underline">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          const daysSinceCreation = differenceInDays(new Date(), template.createdAt);
          const isNew = daysSinceCreation < 7;

          return (
            <div key={template.id} className="relative">
              {isNew && (
                <Badge className="absolute top-2 right-2 z-10 bg-green-500">
                  New
                </Badge>
              )}
              <TemplateCard template={template} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
