'use client';

import Link from 'next/link';
import { StyleChip } from '@/components/ui/style-chip';
import { STYLES } from '@/app/lib/classification';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function StyleChips() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Popular Styles</h2>
        <Link href="/templates" className="text-sm text-primary hover:underline">
          View all →
        </Link>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-4">
          {STYLES.map((style) => (
            <Link key={style} href={`/templates?style=${style}`}>
              <StyleChip style={style} />
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
