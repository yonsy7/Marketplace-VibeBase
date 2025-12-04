import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marshal-ui-yt.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/creator/templates/new',
          '/creator/templates/*/edit',
          '/creator/profile',
          '/creator/dashboard',
          '/user/',
          '/download/',
          '/purchase/',
          '/settings/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
