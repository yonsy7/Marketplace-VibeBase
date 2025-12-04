import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import { TemplateStatus } from '@prisma/client';
import { Resend } from 'resend';
import TemplateRejectedEmail from '@/app/components/emails/TemplateRejectedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification to creator with reason
    if (template.creator.email && resend) {
      try {
        await resend.emails.send({
          from: "MarshalUI <onboarding@resend.dev>",
          to: [template.creator.email],
          subject: `Template Review: ${template.title}`,
          react: TemplateRejectedEmail({
            templateTitle: template.title,
            reason: reason,
          }),
        });
      } catch (error) {
        console.error('Error sending rejection email:', error);
      }
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error rejecting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
