"use client";

import { STYLES, styleLabels, Style } from "@/app/lib/classification";
import { StyleBadge } from "@/components/ui/style-badge";
import Link from "next/link";

interface StyleChipsProps {
  selectedStyle?: Style | null;
  onStyleClick?: (style: Style) => void;
  linkMode?: boolean;
}

export function StyleChips({
  selectedStyle,
  onStyleClick,
  linkMode = true,
}: StyleChipsProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Popular Styles</h2>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {STYLES.map((style) => {
          if (linkMode) {
            return (
              <Link key={style} href={`/templates?style=${style}`}>
                <StyleBadge
                  style={style}
                  size="md"
                  className={
                    selectedStyle === style
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }
                />
              </Link>
            );
          }

          return (
            <StyleBadge
              key={style}
              style={style}
              size="md"
              onClick={() => onStyleClick?.(style)}
              className={
                selectedStyle === style
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }
            />
          );
        })}
      </div>
    </div>
  );
}
