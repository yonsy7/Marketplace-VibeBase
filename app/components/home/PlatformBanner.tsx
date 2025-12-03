"use client";

import { PLATFORMS, PLATFORM_DISPLAY_NAMES } from "@/app/lib/classification";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function PlatformBanner() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Compatible with AI Platforms</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {PLATFORMS.map((platform) => (
          <Link key={platform} href={`/templates?platform=${platform}`}>
            <Badge variant="outline" className="text-sm px-4 py-2 hover:bg-accent cursor-pointer">
              {PLATFORM_DISPLAY_NAMES[platform]}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
