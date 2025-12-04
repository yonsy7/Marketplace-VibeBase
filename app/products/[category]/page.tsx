import { redirect } from 'next/navigation';

export default async function LegacyCategoryPage({ params }: { params: { category: string } }) {
  // Map old categories to new ones
  const categoryMap: Record<string, string> = {
    template: 'marketing-landing',
    uikit: 'product-app-ui',
    icon: 'dashboard-analytics',
  };

  const newCategory = categoryMap[params.category] || params.category;
  redirect(`/templates?category=${newCategory}`);
}
