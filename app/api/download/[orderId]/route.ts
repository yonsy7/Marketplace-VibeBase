import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import prisma from '@/app/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await requireAuth();
    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.buyerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!order.downloadAvailable) {
      return NextResponse.json(
        { error: 'Download not available' },
        { status: 403 }
      );
    }

    // Increment download count
    await prisma.order.update({
      where: { id: orderId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
