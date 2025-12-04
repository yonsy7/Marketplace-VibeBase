import { requireAuth } from '@/app/lib/auth';
import { FavoritesList } from '@/app/components/user/FavoritesList';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'My Favorites',
};

export default async function FavoritesPage() {
  const user = await requireAuth();

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
    },
    include: {
      template: {
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              profileImage: true,
            },
          },
          styles: {
            include: {
              styleTag: true,
            },
            take: 3,
          },
          platforms: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              favorites: true,
            },
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
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground mt-2">
          Templates you've liked and saved
        </p>
      </div>

      <FavoritesList favorites={favorites} />
    </div>
  );
}
