import { requireAdmin } from '@/app/lib/auth';
import { ReviewsTable } from '@/app/components/admin/ReviewsTable';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'Manage Reviews | Admin',
};

export default async function AdminReviewsPage() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      template: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Review and moderate user reviews
        </p>
      </div>

      <ReviewsTable reviews={reviews} />
    </div>
  );
}
