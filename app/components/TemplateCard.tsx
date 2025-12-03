import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { StyleBadge } from "@/components/ui/style-badge";
import { TechStackBadge } from "@/components/ui/tech-stack-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceTag } from "@/components/ui/price-tag";
import { Style, TechStackType } from "@/app/lib/classification";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TemplateCardProps {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  price: number;
  images: string[];
  styles?: Style[];
  techStack?: TechStackType;
  ratingAverage?: number;
  ratingCount?: number;
  likeCount?: number;
  viewCount?: number;
  creatorName?: string;
  creatorImage?: string;
  isNew?: boolean;
}

export function TemplateCard({
  id,
  slug,
  title,
  shortDesc,
  price,
  images,
  styles = [],
  techStack,
  ratingAverage = 0,
  ratingCount = 0,
  likeCount = 0,
  viewCount = 0,
  creatorName,
  creatorImage,
  isNew = false,
}: TemplateCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {images.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <Link href={`/templates/${slug}`}>
                    <div className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>
        ) : images.length === 1 ? (
          <Link href={`/templates/${slug}`}>
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No preview
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isNew && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full">
              New
            </span>
          )}
          {techStack && <TechStackBadge techStack={techStack} size="sm" />}
        </div>

        {/* Like button overlay */}
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <CardContent className="p-4">
        <Link href={`/templates/${slug}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {shortDesc}
        </p>

        {/* Styles */}
        {styles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {styles.slice(0, 3).map((style) => (
              <StyleBadge key={style} style={style} size="sm" />
            ))}
            {styles.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{styles.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {ratingCount > 0 && (
            <RatingStars
              rating={ratingAverage}
              size="sm"
              showValue
              showCount
              count={ratingCount}
            />
          )}
          {likeCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{likeCount}</span>
            </div>
          )}
          {viewCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{viewCount}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {creatorImage && (
            <Image
              src={creatorImage}
              alt={creatorName || "Creator"}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          {creatorName && (
            <span className="text-sm text-muted-foreground">{creatorName}</span>
          )}
        </div>
        <PriceTag price={price} size="lg" />
      </CardFooter>
    </Card>
  );
}
