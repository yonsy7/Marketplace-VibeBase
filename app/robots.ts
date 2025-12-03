import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vibebase.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/creator/",
          "/user/",
          "/settings",
          "/billing",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
