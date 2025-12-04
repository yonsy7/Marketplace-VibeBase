import { requireCreator } from '@/app/lib/auth';
import { StatsCards } from '@/app/components/creator/StatsCards';
import { SalesChart } from '@/app/components/creator/SalesChart';
import { TemplatesTable } from '@/app/components/creator/TemplatesTable';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'Creator Dashboard',
};

export default async function CreatorDashboard() {
  const user = await requireCreator();

  // Fetch creator's templates with stats
  const templates = await prisma.template.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
      orders: {
        select: {
          amount: true,
          platformFee: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const totalSales = templates.reduce((sum, t) => sum + t._count.orders, 0);
  const totalRevenue = templates.reduce(
    (sum, t) => sum + t.orders.reduce((s, o) => s + (o.amount - o.platformFee), 0),
    0
  );
  const totalGrossRevenue = templates.reduce(
    (sum, t) => sum + t.orders.reduce((s, o) => s + o.amount, 0),
    0
  );
  const avgRating =
    templates.length > 0
      ? templates.reduce((sum, t) => sum + t.ratingAverage, 0) / templates.length
      : 0;
  const totalFavorites = templates.reduce((sum, t) => sum + t._count.favorites, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your templates and track your performance
        </p>
      </div>

      <StatsCards
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        totalGrossRevenue={totalGrossRevenue}
        avgRating={avgRating}
        totalFavorites={totalFavorites}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart templates={templates as any} />
        <div className="lg:col-span-2">
          <TemplatesTable templates={templates} />
        </div>
      </div>
    </div>
  );
}
