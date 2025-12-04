import { requireCreator } from '@/app/lib/auth';
import { ProfileForm } from '@/app/components/creator/ProfileForm';
import prisma from '@/app/lib/db';

export const metadata = {
  title: 'Creator Profile',
};

export default async function CreatorProfilePage() {
  const user = await requireCreator();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      profileImage: true,
      connectedAccountId: true,
      stripeConnectedLinked: true,
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Creator Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your public profile and settings
        </p>
      </div>

      <ProfileForm
        user={{
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          username: dbUser.username,
          bio: dbUser.bio,
          avatarUrl: dbUser.avatarUrl || dbUser.profileImage,
          connectedAccountId: dbUser.connectedAccountId,
          stripeConnectedLinked: dbUser.stripeConnectedLinked,
        }}
      />
    </div>
  );
}
