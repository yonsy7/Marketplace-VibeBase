import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TechStackBadge } from "@/app/components/ui/tech-stack-badge";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { TechStack } from "@prisma/client";

interface TemplateCardProps {
  id: string;
  slug: string;
  title: string;
  byline?: string | null;
  shortDesc: string;
  price: number;
  previewImages: any; // JSON array
  techStack: TechStack;
  ratingAverage: number;
  ratingCount: number;
  likeCount: number;
  styles?: Array<{ styleTag: { name: string } }>;
  platforms?: Array<{ platform: string }>;
  creator?: {
    username: string | null;
    firstName: string;
    lastName: string;
  };
}

export function TemplateCard({
  id,
  slug,
  title,
  byline,
  shortDesc,
  price,
  previewImages,
  techStack,
  ratingAverage,
  ratingCount,
  likeCount,
  styles = [],
  platforms = [],
  creator,
}: TemplateCardProps) {
  const images = Array.isArray(previewImages) ? previewImages : [];
  const displayPrice = price === 0 ? "Free" : `$${(price / 100).toFixed(2)}`;

  return (
    <Link href={`/templates/${slug}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative h-full w-full">
                      <Image
                        src={image}
                        alt={`${title} preview ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 opacity-0 transition-opacity group-hover:opacity-100" />
                  <CarouselNext className="right-2 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No preview
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-1">{title}</h3>
                {byline && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{byline}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <Badge variant={price === 0 ? "secondary" : "default"}>
                  {displayPrice}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{shortDesc}</p>

            <div className="flex flex-wrap items-center gap-2">
              <TechStackBadge techStack={techStack} />
              {styles.slice(0, 2).map((style) => (
                <Badge key={style.styleTag.name} variant="outline" className="text-xs">
                  {style.styleTag.name}
                </Badge>
              ))}
              {styles.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{styles.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {ratingCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{ratingAverage.toFixed(1)}</span>
                    <span className="text-xs">({ratingCount})</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{likeCount}</span>
                </div>
              </div>
              {creator && (
                <div className="text-xs text-muted-foreground">
                  by {creator.username || `${creator.firstName} ${creator.lastName}`}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
