import { requireAuth } from '@/app/lib/auth';
import { PurchasesList } from '@/app/components/user/PurchasesList';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'My Purchases',
};

export default async function PurchasesPage() {
  const user = await requireAuth();

  const orders = await prisma.order.findMany({
    where: {
      buyerId: user.id,
      downloadAvailable: true,
    },
    include: {
      template: {
        include: {
          creator: {
            select: {
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          styles: {
            include: {
              styleTag: true,
            },
            take: 1,
          },
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
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground mt-2">
          Templates you&apos;ve purchased and downloaded
        </p>
      </div>

      <PurchasesList orders={orders} />
    </div>
  );
}
