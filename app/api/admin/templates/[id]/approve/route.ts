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

    const template = await prisma.template.update({
      where: { id },
      data: {
        status: TemplateStatus.PUBLISHED,
      },
      include: {
        creator: {
          select: {
            email: true,
          },
        },
      },
    });

    // TODO: Send email notification to creator
    // await sendTemplateApprovedEmail(template.creator.email, template.title);

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error approving template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
