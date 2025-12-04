import { MetadataRoute } from 'next';
import prisma from './lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marshal-ui-yt.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Published templates
  const templates = await prisma.template.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    take: 1000, // Limit to avoid too large sitemap
  });

  const templatePages: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: template.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Creator profiles (public)
  const creators = await prisma.user.findMany({
    where: {
      username: { not: null },
      role: { in: ['CREATOR', 'ADMIN'] },
      Templates: {
        some: {
          status: 'PUBLISHED',
        },
      },
    },
    select: {
      username: true,
      updatedAt: true,
    },
    take: 500,
  });

  const creatorPages: MetadataRoute.Sitemap = creators.map((creator) => ({
    url: `${baseUrl}/creator/${creator.username}`,
    lastModified: creator.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...templatePages, ...creatorPages];
}
