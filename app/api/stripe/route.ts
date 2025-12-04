import PurchaseEmail from "@/app/components/emails/PurchaseEmail";
import NewSaleEmail from "@/app/components/emails/NewSaleEmail";
import { stripe } from "@/app/lib/stripe";
import prisma from "@/app/lib/db";

import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response("webhook error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const templateId = session.metadata?.templateId;
      const link = session.metadata?.link;

      if (templateId) {
        // Create Order for template purchase
        const template = await prisma.template.findUnique({
          where: { id: templateId },
          include: {
            creator: {
              select: {
                connectedAccountId: true,
              },
            },
          },
        });

        if (template) {
          const amount = session.amount_total || 0;
          const platformFee = Math.round(amount * 0.1);

          const order = await prisma.order.create({
            data: {
              buyerId: session.customer as string, // This should be mapped from Stripe customer
              templateId: templateId,
              paymentIntentId: session.payment_intent as string,
              stripeSessionId: session.id,
              amount: amount,
              platformFee: platformFee,
              downloadAvailable: true,
            },
          });

          // Send purchase email to buyer
          const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://marshal-ui-yt.vercel.app'}/download/${order.id}`;
          
          await resend.emails.send({
            from: "MarshalUI <onboarding@resend.dev>",
            to: [session.customer_details?.email as string],
            subject: `Your Template: ${template.title}`,
            react: PurchaseEmail({
              link: downloadLink,
              templateTitle: template.title,
            }),
          });

          // Send sale notification email to creator
          const creator = await prisma.user.findUnique({
            where: { id: template.creatorId },
            select: { email: true },
          });

          if (creator) {
            const netAmount = amount - platformFee;
            await resend.emails.send({
              from: "MarshalUI <onboarding@resend.dev>",
              to: [creator.email],
              subject: `New Sale: ${template.title}`,
              react: NewSaleEmail({
                templateTitle: template.title,
                amount: amount,
                platformFee: platformFee,
                netAmount: netAmount,
                templateSlug: template.slug,
              }),
            });
          }
        }
      }

      break;
    }
    default: {
      console.log("unhandled event");
    }
  }

  return new Response(null, { status: 200 });
}
