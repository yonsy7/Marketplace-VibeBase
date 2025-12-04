import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        template: {
          include: {
            creator: {
              select: {
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            styles: {
              include: {
                styleTag: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 });
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        templateId,
        userId: user.id,
      },
    });

    // Update template like count
    await prisma.template.update({
      where: { id: templateId },
      data: { likeCount: { increment: 1 } },
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
