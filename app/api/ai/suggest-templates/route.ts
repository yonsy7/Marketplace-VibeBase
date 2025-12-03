import { NextRequest, NextResponse } from 'next/server';
import { openai, generateEmbedding, generateMatchExplanation } from '@/app/lib/openai';
import prisma from '@/app/lib/db';
import { TemplateStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // For now, use simple text search until embeddings are fully set up
    // TODO: Implement vector search with embeddings

    // Simple keyword-based search
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    const templates = await prisma.template.findMany({
      where: {
        status: TemplateStatus.PUBLISHED,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { shortDesc: { contains: query, mode: 'insensitive' } },
          { byline: { contains: query, mode: 'insensitive' } },
        ],
      },
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
      take: 6,
    });

    // Calculate relevance score and generate explanations
    const results = await Promise.all(
      templates.map(async (template) => {
        // Simple scoring based on matches
        let score = 0.5; // Base score
        
        const titleLower = template.title.toLowerCase();
        const descLower = template.shortDesc.toLowerCase();
        
        searchTerms.forEach((term) => {
          if (titleLower.includes(term)) score += 0.2;
          if (descLower.includes(term)) score += 0.1;
        });

        // Boost by popularity
        score += Math.min(template.ratingAverage / 10, 0.2);
        score += Math.min(template.likeCount / 100, 0.1);

        score = Math.min(score, 1.0);

        // Generate explanation if OpenAI is available
        let explanation = `This template matches your request: ${template.title}`;
        if (openai) {
          try {
            explanation = await generateMatchExplanation(
              query,
              template.title,
              template.shortDesc
            );
          } catch (error) {
            console.error('Error generating explanation:', error);
          }
        }

        return {
          id: template.id,
          slug: template.slug,
          title: template.title,
          byline: template.byline,
          shortDesc: template.shortDesc,
          price: template.price,
          techStack: template.techStack,
          previewImages: template.previewImages,
          ratingAverage: template.ratingAverage,
          ratingCount: template.ratingCount,
          likeCount: template.likeCount,
          styles: template.styles.map((s) => ({ styleTag: { name: s.styleTag.name } })),
          platforms: template.platforms,
          score: Math.round(score * 100) / 100,
          explanation,
        };
      })
    );

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      templates: results,
      meta: {
        totalMatches: results.length,
        query: query.trim(),
      },
    });
  } catch (error) {
    console.error('Error in AI suggest templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
