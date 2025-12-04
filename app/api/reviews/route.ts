import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        templateId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { templateId, rating, comment } = await request.json();

    if (!templateId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Template ID and valid rating (1-5) are required' },
        { status: 400 }
      );
    }

    // Check if user has purchased the template
    const order = await prisma.order.findFirst({
      where: {
        buyerId: user.id,
        templateId,
        downloadAvailable: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'You must purchase this template before reviewing' },
        { status: 403 }
      );
    }

    // Check if review already exists
    const existing = await prisma.review.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: user.id,
        },
      },
    });

    let review;
    if (existing) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          comment: comment || null,
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          templateId,
          userId: user.id,
          rating,
          comment: comment || null,
        },
      });
    }

    // Recalculate template rating
    const allReviews = await prisma.review.findMany({
      where: { templateId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.template.update({
      where: { id: templateId },
      data: {
        ratingAverage: avgRating,
        ratingCount: allReviews.length,
      },
    });

    return NextResponse.json({ review });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Review already exists' }, { status: 400 });
    }
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
