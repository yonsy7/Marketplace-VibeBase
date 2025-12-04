import { requireAdmin } from '@/app/lib/auth';
import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { TemplateReview } from '@/app/components/admin/TemplateReview';
import { ApproveRejectActions } from '@/app/components/admin/ApproveRejectActions';

export const metadata = {
  title: 'Template Review',
};

export default async function AdminTemplatePage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const template = await prisma.template.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
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
    },
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Template Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and moderate template: {template.title}
        </p>
      </div>

      <TemplateReview template={template} />

      <ApproveRejectActions templateId={template.id} currentStatus={template.status} />
    </div>
  );
}
