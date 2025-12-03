"use client";

import { CATEGORIES } from "@/app/lib/classification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categoryIcons: Record<string, string> = {
  "Marketing & Landing": "🚀",
  "Product & App UI": "📱",
  "Dashboard & Analytics": "📊",
};

const categoryDescriptions: Record<string, string> = {
  "Marketing & Landing": "Landing pages, marketing sites, and conversion-focused designs",
  "Product & App UI": "Application interfaces, user flows, and product experiences",
  "Dashboard & Analytics": "Data visualization, admin panels, and analytics dashboards",
};

export function CategoryCards() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <Link key={category} href={`/templates?category=${encodeURIComponent(category)}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-4xl mb-2">{categoryIcons[category]}</div>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{categoryDescriptions[category]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-primary font-medium">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
