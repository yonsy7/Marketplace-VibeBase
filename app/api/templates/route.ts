import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { TemplateStatus, TechStack, PlatformType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Filtres
    const status = searchParams.get('status') as TemplateStatus | null;
    const techStack = searchParams.get('techStack') as TechStack | null;
    const styles = searchParams.getAll('style');
    const categories = searchParams.getAll('category');
    const subcategories = searchParams.getAll('subcategory');
    const tags = searchParams.getAll('tag');
    const platforms = searchParams.getAll('platform') as PlatformType[];
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : null;
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : null;
    const search = searchParams.get('search');

    // Tri
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, price-asc, price-desc, rating, likes

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const skip = (page - 1) * limit;

    // Construction de la query
    const where: any = {};

    // Filtre par statut (par défaut PUBLISHED pour les utilisateurs non-admin)
    if (status) {
      where.status = status;
    } else {
      where.status = TemplateStatus.PUBLISHED;
    }

    // Filtre par tech stack
    if (techStack) {
      where.techStack = techStack;
    }

    // Filtre par styles
    if (styles.length > 0) {
      where.styles = {
        some: {
          styleTag: {
            name: {
              in: styles,
            },
          },
        },
      };
    }

    // Filtre par catégories
    if (categories.length > 0) {
      where.categories = {
        some: {
          category: {
            id: {
              in: categories,
            },
          },
        },
      };
    }

    // Filtre par sous-catégories
    if (subcategories.length > 0) {
      where.subcategories = {
        some: {
          subcategory: {
            id: {
              in: subcategories,
            },
          },
        },
      };
    }

    // Filtre par tags
    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            id: {
              in: tags,
            },
          },
        },
      };
    }

    // Filtre par plateformes
    if (platforms.length > 0) {
      where.platforms = {
        some: {
          platform: {
            in: platforms,
          },
        },
      };
    }

    // Filtre par prix (en cents)
    if (priceMin !== null || priceMax !== null) {
      where.price = {};
      if (priceMin !== null) {
        where.price.gte = priceMin * 100;
      }
      if (priceMax !== null) {
        where.price.lte = priceMax * 100;
      }
    }

    // Recherche textuelle
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
        { byline: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Construction du tri
    let orderBy: any = {};
    switch (sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        // Score combiné: ventes + likes + vues + rating
        // Pour l'instant, on trie par likeCount + viewCount + ratingAverage
        orderBy = [
          { likeCount: 'desc' },
          { viewCount: 'desc' },
          { ratingAverage: 'desc' },
        ];
        break;
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { ratingAverage: 'desc' };
        break;
      case 'likes':
        orderBy = { likeCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Requête avec comptage total
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
              username: true,
              firstName: true,
              lastName: true,
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
          _count: {
            select: {
              orders: true,
              reviews: true,
              favorites: true,
            },
          },
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
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
