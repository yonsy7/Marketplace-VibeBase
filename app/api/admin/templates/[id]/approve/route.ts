import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import { TemplateStatus } from '@prisma/client';
import { Resend } from 'resend';
import TemplateApprovedEmail from '@/app/components/emails/TemplateApprovedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification to creator
    if (template.creator.email && resend) {
      try {
        await resend.emails.send({
          from: "MarshalUI <onboarding@resend.dev>",
          to: [template.creator.email],
          subject: `Template Approved: ${template.title}`,
          react: TemplateApprovedEmail({
            templateTitle: template.title,
            templateSlug: template.slug,
          }),
        });
      } catch (error) {
        console.error('Error sending approval email:', error);
      }
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error approving template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
