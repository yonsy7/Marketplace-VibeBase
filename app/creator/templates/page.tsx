import { requireCreator } from '@/app/lib/auth';
import { TemplatesTable } from '@/app/components/creator/TemplatesTable';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'My Templates',
};

export default async function CreatorTemplatesPage() {
  const user = await requireCreator();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Templates</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your templates
          </p>
        </div>
        <a
          href="/creator/templates/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Create New Template
        </a>
      </div>

      <TemplatesTable templates={templates} />
    </div>
  );
}
