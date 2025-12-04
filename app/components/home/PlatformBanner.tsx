'use client';

import Link from 'next/link';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { PLATFORMS } from '@/app/lib/classification';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function PlatformBanner() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">AI Platform Compatible</h2>
        <Link href="/templates" className="text-sm text-primary hover:underline">
          View all →
        </Link>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-6 pb-4">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform}
              href={`/templates?platform=${platform}`}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary transition-colors min-w-[120px]">
                <PlatformIcon platform={platform} size="md" showLabel={false} />
                <span className="text-xs text-center text-muted-foreground">
                  {platform.replace('_', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
