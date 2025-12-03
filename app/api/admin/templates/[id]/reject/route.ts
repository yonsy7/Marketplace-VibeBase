import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import { TemplateStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const { reason } = await request.json();

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const template = await prisma.template.update({
      where: { id },
      data: {
        status: TemplateStatus.REJECTED,
      },
      include: {
        creator: {
          select: {
            email: true,
          },
        },
      },
    });

    // TODO: Send email notification to creator with reason
    // await sendTemplateRejectedEmail(template.creator.email, template.title, reason);

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error rejecting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
