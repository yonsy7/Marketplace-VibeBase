import { requireCreator } from '@/app/lib/auth';
import { TemplateForm } from '@/app/components/creator/TemplateForm';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'Create New Template',
};

export default async function NewTemplatePage() {
  await requireCreator();

  // Fetch categories and subcategories for the form
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });

  const styleTags = await prisma.styleTag.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <p className="text-muted-foreground mt-2">
          Share your AI-ready design template with the community
        </p>
      </div>

      <TemplateForm
        categories={categories}
        styleTags={styleTags}
        tags={tags}
      />
    </div>
  );
}
