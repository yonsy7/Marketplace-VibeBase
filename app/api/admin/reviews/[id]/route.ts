import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get review to delete
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        template: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: params.id },
    });

    // Recalculate template ratings
    const templateReviews = await prisma.review.findMany({
      where: { templateId: review.templateId },
      select: { rating: true },
    });

    const ratingCount = templateReviews.length;
    const ratingAverage =
      ratingCount > 0
        ? templateReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    await prisma.template.update({
      where: { id: review.templateId },
      data: {
        ratingCount,
        ratingAverage,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
