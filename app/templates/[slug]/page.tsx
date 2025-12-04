import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { TemplateHeader } from '@/app/components/template/TemplateHeader';
import { TemplatePreview } from '@/app/components/template/TemplatePreview';
import { TemplateGallery } from '@/app/components/template/TemplateGallery';
import { TemplateActions } from '@/app/components/template/TemplateActions';
import { TemplateDetails } from '@/app/components/template/TemplateDetails';
import { CreatorInfo } from '@/app/components/template/CreatorInfo';
import { RelatedTemplates } from '@/app/components/template/RelatedTemplates';
import { ReviewsList } from '@/app/components/reviews/ReviewsList';
import { ReviewSummary } from '@/app/components/reviews/ReviewSummary';
import { Breadcrumbs } from '@/app/components/layout/Breadcrumbs';

interface TemplatePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      byline: true,
      shortDesc: true,
      previewImages: true,
    },
  });

  if (!template) {
    return {
      title: 'Template Not Found',
    };
  }

  const previewImage =
    template.previewImages &&
    typeof template.previewImages === 'object' &&
    'images' in template.previewImages
      ? (template.previewImages as any).images?.[0]
      : null;

  return {
    title: `${template.title} | AI-Ready Design Template`,
    description: template.shortDesc,
    openGraph: {
      title: template.title,
      description: template.shortDesc,
      images: previewImage ? [previewImage] : [],
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatarUrl: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      subcategories: {
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      platforms: true,
      files: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  });

  if (!template || template.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment view count
  await prisma.template.update({
    where: { id: template.id },
    data: { viewCount: { increment: 1 } },
  });

  // Get related templates
  const relatedTemplates = await prisma.template.findMany({
    where: {
      id: { not: template.id },
      status: 'PUBLISHED',
      OR: [
        { creatorId: template.creatorId },
        {
          styles: {
            some: {
              styleTag: {
                name: {
                  in: template.styles.map((s) => s.styleTag.name),
                },
              },
            },
          },
        },
      ],
    },
    take: 6,
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
        },
        take: 1,
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Templates', href: '/templates' },
          { label: template.title },
        ]}
        className="mb-6"
      />
      <TemplateHeader template={template} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <TemplatePreview template={template} />
          <TemplateGallery template={template} />
          <TemplateDetails template={template} />
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <ReviewSummary template={template} />
            </div>
            <ReviewsList templateId={template.id} initialReviews={template.reviews || []} />
          </div>
        </div>

        <div className="space-y-6">
          <TemplateActions 
            template={template} 
            canDownload={false} // TODO: Check if user has purchased
          />
          <CreatorInfo creator={template.creator} />
        </div>
      </div>

      {relatedTemplates.length > 0 && (
        <div className="mt-12">
          <RelatedTemplates templates={relatedTemplates} />
        </div>
      )}
    </div>
  );
}
