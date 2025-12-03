import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StyleBadge } from "@/components/ui/style-badge";
import { TechStackBadge } from "@/components/ui/tech-stack-badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceTag } from "@/components/ui/price-tag";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Heart,
  Eye,
  Download,
  ExternalLink,
  Calendar,
  User,
  FileCode,
  Check,
} from "lucide-react";
import { BuyProduct } from "@/app/actions";
import { ProductDescription } from "@/app/components/ProductDescription";
import { Style, Platform, TechStackType } from "@/app/lib/classification";
import { format } from "date-fns";

async function getTemplate(slug: string) {
  noStore();

  const template = await prisma.template.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          username: true,
          bio: true,
          connectedAccountId: true,
        },
      },
      styles: {
        include: {
          style: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      subcategories: {
        include: {
          subcategory: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      platforms: true,
      files: true,
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!template || template.status !== "PUBLISHED") {
    return null;
  }

  // Increment view count
  await prisma.template.update({
    where: { id: template.id },
    data: { viewCount: { increment: 1 } },
  });

  return template;
}

async function getRelatedTemplates(templateId: string, creatorId: string) {
  return prisma.template.findMany({
    where: {
      creatorId,
      id: { not: templateId },
      status: "PUBLISHED",
    },
    take: 4,
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });
}

export default async function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const template = await getTemplate(params.slug);

  if (!template) {
    notFound();
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const relatedTemplates = await getRelatedTemplates(
    template.id,
    template.creatorId
  );

  const images = template.previewImages
    ? (template.previewImages as string[])
    : [];
  const isFree = template.price === 0;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden bg-gray-100">
            {images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video">
                        <Image
                          src={image}
                          alt={`${template.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                No preview available
              </div>
            )}
          </div>

          {/* Template Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TechStackBadge
                techStack={template.techStack as TechStackType}
                size="md"
              />
              {template.platforms.map((p) => (
                <PlatformBadge
                  key={p.platform}
                  platform={p.platform as Platform}
                  size="sm"
                />
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
            {template.byline && (
              <p className="text-lg text-muted-foreground mb-4">
                {template.byline}
              </p>
            )}

            <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
              {template.ratingCount > 0 && (
                <RatingStars
                  rating={template.ratingAverage}
                  showValue
                  showCount
                  count={template.ratingCount}
                />
              )}
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{template.likeCount} favorites</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{template.viewCount} views</span>
              </div>
            </div>

            {/* Styles */}
            {template.styles.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {template.styles.map((s) => (
                    <Link
                      key={s.style.id}
                      href={`/templates?style=${s.style.slug}`}
                    >
                      <StyleBadge style={s.style.slug as Style} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {template.categories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {template.categories.map((c) => (
                    <Link
                      key={c.category.id}
                      href={`/templates?category=${c.category.slug}`}
                    >
                      <Badge variant="secondary">{c.category.name}</Badge>
                    </Link>
                  ))}
                  {template.subcategories.map((s) => (
                    <Badge key={s.subcategory.id} variant="outline">
                      {s.subcategory.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((t) => (
                    <Badge key={t.tag.id} variant="outline">
                      #{t.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this template</h2>
              <p className="text-muted-foreground mb-4">{template.shortDesc}</p>
              {template.longDesc && (
                <div className="prose prose-sm max-w-none">
                  <ProductDescription content={JSON.parse(template.longDesc)} />
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Whats included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">What is included</h2>
              <ul className="space-y-2">
                {template.files.map((file) => (
                  <li key={file.id} className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" />
                    <span>{file.fileName}</span>
                    {file.fileSize && (
                      <span className="text-sm text-muted-foreground">
                        ({(file.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </li>
                ))}
                {template.files.length === 0 && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Complete template files</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <PriceTag price={template.price} size="xl" />
                {isFree && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Free
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <form action={BuyProduct}>
                  <input type="hidden" name="id" value={template.id} />
                  <Button type="submit" className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    {isFree ? "Download Free" : "Buy Now"}
                  </Button>
                </form>
              ) : (
                <Link href="/api/auth/login" className="block">
                  <Button className="w-full" size="lg">
                    Sign in to purchase
                  </Button>
                </Link>
              )}

              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Add to favorites
              </Button>

              {template.liveDemoUrl && (
                <a
                  href={template.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Preview
                  </Button>
                </a>
              )}

              <Separator />

              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Published {format(new Date(template.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Instant download after purchase</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Image
                  src={template.creator.profileImage}
                  alt={`${template.creator.firstName} ${template.creator.lastName}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {template.creator.firstName} {template.creator.lastName}
                  </p>
                  {template.creator.username && (
                    <Link
                      href={`/creator/${template.creator.username}`}
                      className="text-sm text-primary hover:underline"
                    >
                      @{template.creator.username}
                    </Link>
                  )}
                </div>
              </div>
              {template.creator.bio && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {template.creator.bio}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Templates */}
      {relatedTemplates.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">More from this creator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTemplates.map((related) => (
              <Card key={related.id} className="overflow-hidden">
                <Link href={`/templates/${related.slug}`}>
                  <div className="aspect-video bg-gray-100 relative">
                    {related.previewImages &&
                    (related.previewImages as string[])[0] ? (
                      <Image
                        src={(related.previewImages as string[])[0]}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No preview
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{related.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {related.shortDesc}
                    </p>
                    <PriceTag price={related.price} size="sm" className="mt-2" />
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      shortDesc: true,
      previewImages: true,
    },
  });

  if (!template) {
    return {
      title: "Template Not Found | VibeBase",
    };
  }

  const images = template.previewImages
    ? (template.previewImages as string[])
    : [];

  return {
    title: `${template.title} | VibeBase`,
    description: template.shortDesc,
    openGraph: {
      title: template.title,
      description: template.shortDesc,
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}
