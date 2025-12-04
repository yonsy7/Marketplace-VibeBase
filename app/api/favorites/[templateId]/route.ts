import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import prisma from '@/app/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const user = await requireAuth();
    const { templateId } = params;

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        templateId_userId: {
          templateId,
          userId: user.id,
        },
      },
    });

    // Update template like count
    await prisma.template.update({
      where: { id: templateId },
      data: { likeCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const user = await requireAuth();
    const { templateId } = params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
