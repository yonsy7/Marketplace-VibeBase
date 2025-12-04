import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { ReviewSummary } from '@/app/components/reviews/ReviewSummary';
import { ReviewsList } from '@/app/components/reviews/ReviewsList';
import { ReviewForm } from '@/app/components/reviews/ReviewForm';
import { requireAuth } from '@/app/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TemplateReviewsPage({ params }: { params: { slug: string } }) {
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
    select: { id: true, title: true, status: true },
  });

  if (!template || template.status !== 'PUBLISHED') {
    notFound();
  }

  // Check if user can review (has purchased)
  let canReview = false;
  let existingReview = null;

  try {
    const user = await requireAuth();
    const order = await prisma.order.findFirst({
      where: {
        buyerId: user.id,
        templateId: template.id,
        downloadAvailable: true,
      },
    });

    if (order) {
      canReview = true;
      existingReview = await prisma.review.findUnique({
        where: {
          templateId_userId: {
            templateId: template.id,
            userId: user.id,
          },
        },
      });
    }
  } catch {
    // User not authenticated
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-2">{template.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewSummary template={template as any} />
            </CardContent>
          </Card>

          {canReview && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{existingReview ? 'Edit Your Review' : 'Write a Review'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  templateId={template.id}
                  existingReview={existingReview ? {
                    id: existingReview.id,
                    rating: existingReview.rating,
                    comment: existingReview.comment || undefined,
                  } : undefined}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsList templateId={template.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
