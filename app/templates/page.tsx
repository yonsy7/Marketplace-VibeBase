import { Suspense } from "react";
import { TemplateCard } from "@/app/components/TemplateCard";
import prisma from "@/app/lib/db";
import { TemplateStatus } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

async function TemplatesGrid() {
  const templates = await prisma.template.findMany({
    where: {
      status: TemplateStatus.PUBLISHED,
    },
    take: 12,
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
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No templates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
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
      ))}
    </div>
  );
}

function TemplateCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Templates</h1>
        <p className="text-muted-foreground">
          Discover AI-ready design templates for your next project
        </p>
      </div>

      <Suspense fallback={<TemplateCardSkeleton />}>
        <TemplatesGrid />
      </Suspense>
    </div>
  );
}
