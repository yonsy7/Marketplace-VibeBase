import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';

export default async function LegacyProductPage({ params }: { params: { id: string } }) {
  // Try to find as Product first
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { name: true },
  });

  if (product) {
    // Generate slug from name and redirect
    const { generateSlug } = await import('@/app/lib/slug');
    const slug = generateSlug(product.name);
    
    // Try to find template by slug
    const template = await prisma.template.findUnique({
      where: { slug },
      select: { slug: true },
    });

    if (template) {
      redirect(`/templates/${template.slug}`);
    }
  }

  // Try to find as Template by ID
  const template = await prisma.template.findUnique({
    where: { id: params.id },
    select: { slug: true },
  });

  if (template) {
    redirect(`/templates/${template.slug}`);
  }

  // If not found, redirect to templates page
  redirect('/templates');
}
