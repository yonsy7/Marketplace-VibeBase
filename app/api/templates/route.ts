import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { TemplateStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const styles = searchParams.get("style")?.split(",").filter(Boolean) || [];
  const categories = searchParams.get("category")?.split(",").filter(Boolean) || [];
  const subcategories = searchParams.get("subcategory")?.split(",").filter(Boolean) || [];
  const tags = searchParams.get("tag")?.split(",").filter(Boolean) || [];
  const techStack = searchParams.get("stack") as any;
  const platforms = searchParams.get("platform")?.split(",").filter(Boolean) || [];
  const priceFilter = searchParams.get("price"); // "free", "paid", or "0-50"
  const sort = searchParams.get("sort") || "recent"; // recent, popular, price-asc, price-desc, rating, likes

  // Build where clause
  const where: any = {
    status: TemplateStatus.PUBLISHED,
  };

  if (styles.length > 0) {
    where.styles = {
      some: {
        styleTag: {
          name: { in: styles },
        },
      },
    };
  }

  if (categories.length > 0) {
    where.categories = {
      some: {
        category: {
          name: { in: categories },
        },
      },
    };
  }

  if (subcategories.length > 0) {
    where.subcategories = {
      some: {
        subcategory: {
          name: { in: subcategories },
        },
      },
    };
  }

  if (tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          name: { in: tags },
        },
      },
    };
  }

  if (techStack) {
    where.techStack = techStack;
  }

  if (platforms.length > 0) {
    where.platforms = {
      some: {
        platform: { in: platforms },
      },
    };
  }

  if (priceFilter === "free") {
    where.price = 0;
  } else if (priceFilter === "paid") {
    where.price = { gt: 0 };
  } else if (priceFilter?.includes("-")) {
    const [min, max] = priceFilter.split("-").map(Number);
    where.price = { gte: min * 100, lte: max * 100 }; // Convert to cents
  }

  // Build orderBy
  let orderBy: any = {};
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "popular":
      // Popularity score: views + likes + sales
      orderBy = [
        { viewCount: "desc" },
        { likeCount: "desc" },
        { createdAt: "desc" },
      ];
      break;
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { ratingAverage: "desc" };
      break;
    case "likes":
      orderBy = { likeCount: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  // Get templates
  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
        categories: {
          include: {
            category: true,
          },
        },
        platforms: true,
      },
    }),
    prisma.template.count({ where }),
  ]);

  return NextResponse.json({
    templates,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
