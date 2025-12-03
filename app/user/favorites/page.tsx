import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { TemplateCard } from "@/app/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Style, TechStackType } from "@/app/lib/classification";

async function getFavorites(userId: string) {
  noStore();

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      template: {
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          styles: {
            include: {
              style: true,
            },
          },
        },
      },
    },
  });

  return favorites;
}

export default async function FavoritesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const favorites = await getFavorites(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground">
          Templates you have saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No favorites saved</h3>
          <p className="text-muted-foreground mb-6">
            Browse templates and click the heart icon to save them here
          </p>
          <Link href="/templates">
            <Button>Explore Templates</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <TemplateCard
              key={favorite.id}
              id={favorite.template.id}
              slug={favorite.template.slug}
              title={favorite.template.title}
              shortDesc={favorite.template.shortDesc}
              price={favorite.template.price}
              images={
                favorite.template.previewImages
                  ? (favorite.template.previewImages as string[])
                  : []
              }
              styles={favorite.template.styles.map((s) => s.style.slug as Style)}
              techStack={favorite.template.techStack as TechStackType}
              ratingAverage={favorite.template.ratingAverage}
              ratingCount={favorite.template.ratingCount}
              likeCount={favorite.template.likeCount}
              viewCount={favorite.template.viewCount}
              creatorName={`${favorite.template.creator.firstName} ${favorite.template.creator.lastName}`}
              creatorImage={favorite.template.creator.profileImage}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export const metadata = {
  title: "My Favorites | VibeBase",
  description: "Your saved templates",
};
