'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/app/lib/uploadthing';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  minImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 4, minImages = 2 }: ImageUploaderProps) {
  const handleUploadComplete = (res: Array<{ url: string }>) => {
    const newImages = res.map((file) => file.url);
    onChange([...images, ...newImages].slice(0, maxImages));
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Main
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            console.error('Upload error:', error);
          }}
        />
      )}

      <p className="text-sm text-muted-foreground">
        {images.length}/{maxImages} images
        {minImages && images.length < minImages && (
          <span className="text-destructive ml-2">
            (Minimum {minImages} required)
          </span>
        )}
      </p>
    </div>
  );
}
