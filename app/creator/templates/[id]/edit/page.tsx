import { requireCreator } from '@/app/lib/auth';
import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { TemplateForm } from '@/app/components/creator/TemplateForm';

export const metadata = {
  title: 'Edit Template',
};

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const user = await requireCreator();

  const template = await prisma.template.findUnique({
    where: { id: params.id },
    include: {
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
    },
  });

  if (!template) {
    notFound();
  }

  // Verify ownership
  if (template.creatorId !== user.id && user.role !== 'ADMIN') {
    notFound();
  }

  // Fetch categories and subcategories for the form
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });

  const styleTags = await prisma.styleTag.findMany();
  const tags = await prisma.tag.findMany();

  // Prepare form data
  const initialData = {
    title: template.title,
    byline: template.byline || '',
    shortDesc: template.shortDesc,
    techStack: template.techStack,
    price: template.price / 100, // Convert from cents
    isPaid: template.price > 0,
    liveDemoUrl: template.liveDemoUrl || '',
    images: template.previewImages && typeof template.previewImages === 'object' && 'images' in template.previewImages
      ? (template.previewImages as any).images || []
      : [],
    styles: template.styles.map((s) => s.styleTag.name),
    categoryIds: template.categories.map((c) => c.categoryId),
    subcategoryIds: template.subcategories.map((s) => s.subcategoryId),
    tagIds: template.tags.map((t) => t.tagId),
    platforms: template.platforms.map((p) => p.platform),
    files: template.files.map((f) => ({
      url: f.fileUrl,
      type: f.fileType,
      name: f.fileName,
      isPreview: f.isPreview,
    })),
    description: template.longDesc ? JSON.stringify(template.longDesc) : '',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground mt-2">
          Update your template: {template.title}
        </p>
      </div>

      <TemplateForm
        categories={categories}
        styleTags={styleTags}
        tags={tags}
        initialData={initialData}
        templateId={template.id}
        isEdit={true}
      />
    </div>
  );
}
