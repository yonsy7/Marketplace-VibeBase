'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface TemplateGalleryProps {
  template: {
    previewImages?: any;
  };
}

export function TemplateGallery({ template }: TemplateGalleryProps) {
  const images =
    template.previewImages &&
    typeof template.previewImages === 'object' &&
    'images' in template.previewImages
      ? (template.previewImages as any).images || []
      : [];

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Gallery</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image: string, index: number) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
