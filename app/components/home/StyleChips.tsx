"use client";

import { STYLES } from "@/app/lib/classification";
import { StyleChip } from "@/app/components/ui/style-chip";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function StyleChips() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Popular Styles</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STYLES.map((style) => (
          <Link key={style} href={`/templates?style=${style}`}>
            <StyleChip style={style} />
          </Link>
        ))}
      </div>
    </div>
  );
}
