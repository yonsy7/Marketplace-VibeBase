import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { PublicProfile } from '@/app/components/creator/PublicProfile';
import { CreatorTemplates } from '@/app/components/creator/CreatorTemplates';
import { Breadcrumbs } from '@/app/components/layout/Breadcrumbs';

interface CreatorPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: CreatorPageProps) {
  const creator = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
      profileImage: true,
    },
  });

  if (!creator) {
    return {
      title: 'Creator Not Found',
    };
  }

  return {
    title: `${creator.firstName} ${creator.lastName} | Creator Profile`,
    description: creator.bio || `View templates by ${creator.firstName} ${creator.lastName}`,
    openGraph: {
      title: `${creator.firstName} ${creator.lastName}`,
      description: creator.bio || '',
      images: creator.avatarUrl || creator.profileImage ? [creator.avatarUrl || creator.profileImage] : [],
    },
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const creator = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      Templates: {
        where: {
          status: 'PUBLISHED',
        },
        include: {
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
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          Templates: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
  });

  if (!creator) {
    notFound();
  }

  // Calculate stats
  const publishedTemplates = creator.Templates;
  const totalSales = publishedTemplates.reduce((sum, t) => sum + t._count.orders, 0);
  const totalLikes = publishedTemplates.reduce((sum, t) => sum + t._count.favorites, 0);
  const avgRating =
    publishedTemplates.length > 0
      ? publishedTemplates.reduce((sum, t) => sum + t.ratingAverage, 0) / publishedTemplates.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Creators', href: '/templates' },
          { label: `${creator.firstName} ${creator.lastName}` },
        ]}
        className="mb-6"
      />
      <PublicProfile
        creator={{
          id: creator.id,
          username: creator.username || '',
          firstName: creator.firstName,
          lastName: creator.lastName,
          bio: creator.bio,
          avatarUrl: creator.avatarUrl || creator.profileImage,
        }}
        stats={{
          templateCount: creator._count.Templates,
          totalSales,
          totalLikes,
          avgRating,
        }}
      />

      <CreatorTemplates templates={publishedTemplates} />
    </div>
  );
}
