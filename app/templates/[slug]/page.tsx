import { notFound } from "next/navigation";
import prisma from "@/app/lib/db";
import { TemplateStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TechStackBadge } from "@/app/components/ui/tech-stack-badge";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Star, Heart, ExternalLink } from "lucide-react";
import { BuyProduct } from "@/app/actions";

interface TemplatePageProps {
  params: {
    slug: string;
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await prisma.template.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
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
    },
  });

  if (!template) {
    notFound();
  }

  const images = Array.isArray(template.previewImages) ? template.previewImages : [];
  const displayPrice = template.price === 0 ? "Free" : `$${(template.price / 100).toFixed(2)}`;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Preview */}
        <div className="space-y-4">
          {images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={image}
                        alt={`${template.title} preview ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No preview available</p>
            </div>
          )}

          {template.liveDemoUrl && (
            <Button asChild variant="outline" className="w-full">
              <a href={template.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Demo
              </a>
            </Button>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{template.title}</h1>
              <Badge variant={template.price === 0 ? "secondary" : "default"} className="text-lg">
                {displayPrice}
              </Badge>
            </div>
            {template.byline && (
              <p className="text-xl text-muted-foreground mb-4">{template.byline}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <TechStackBadge techStack={template.techStack} />
              {template.styles.map((style) => (
                <Badge key={style.styleTag.name} variant="outline">
                  {style.styleTag.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {template.ratingCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{template.ratingAverage.toFixed(1)}</span>
                  <span>({template.ratingCount} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{template.likeCount} favorites</span>
              </div>
            </div>

            <p className="text-lg mb-6">{template.shortDesc}</p>
          </div>

          {/* Categories & Tags */}
          <div className="space-y-4">
            {template.categories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {template.categories.map((cat) => (
                    <Badge key={cat.category.id} variant="secondary">
                      {cat.category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {template.subcategories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Subcategories</h3>
                <div className="flex flex-wrap gap-2">
                  {template.subcategories.map((sub) => (
                    <Badge key={sub.subcategory.id} variant="outline">
                      {sub.subcategory.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {template.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag.tag.id} variant="outline">
                      {tag.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {template.platforms.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Compatible Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {template.platforms.map((platform) => (
                    <Badge key={platform.id} variant="outline">
                      {platform.platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Creator Info */}
          {template.creator && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Created by</p>
              <Link
                href={`/creator/${template.creator.username || template.creator.id}`}
                className="font-medium hover:underline"
              >
                {template.creator.username || `${template.creator.firstName} ${template.creator.lastName}`}
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t">
            {template.price === 0 ? (
              <Button className="w-full" size="lg">
                Download Free
              </Button>
            ) : (
              <form action={BuyProduct}>
                <input type="hidden" name="id" value={template.id} />
                <Button type="submit" className="w-full" size="lg">
                  Buy for {displayPrice}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Full Description */}
      {template.longDesc && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="prose max-w-none">
            {/* TODO: Render TipTap JSON content */}
            <p className="whitespace-pre-wrap">{template.longDesc}</p>
          </div>
        </div>
      )}

      {/* Files Included */}
      {template.files.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Files Included</h2>
          <ul className="list-disc list-inside space-y-2">
            {template.files.map((file) => (
              <li key={file.id}>
                {file.fileName} ({file.fileType})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
