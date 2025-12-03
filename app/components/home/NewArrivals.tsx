import { TemplateCard } from "@/app/components/TemplateCard";
import prisma from "@/app/lib/db";
import { TemplateStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";

export async function NewArrivals() {
  const templates = await prisma.template.findMany({
    where: {
      status: TemplateStatus.PUBLISHED,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
        },
      },
      platforms: true,
    },
  });

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">New Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          const daysSinceCreation = differenceInDays(new Date(), template.createdAt);
          const isNew = daysSinceCreation < 7;

          return (
            <div key={template.id} className="relative">
              {isNew && (
                <Badge className="absolute top-2 right-2 z-10">New</Badge>
              )}
              <TemplateCard
                id={template.id}
                slug={template.slug}
                title={template.title}
                byline={template.byline}
                shortDesc={template.shortDesc}
                price={template.price}
                previewImages={template.previewImages}
                techStack={template.techStack}
                ratingAverage={template.ratingAverage}
                ratingCount={template.ratingCount}
                likeCount={template.likeCount}
                styles={template.styles}
                platforms={template.platforms}
                creator={template.creator}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
