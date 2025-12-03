import Link from "next/link";
import { categoryItems } from "@/app/lib/categroyItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CategoryCards() {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryItems.map((category) => (
          <Link
            key={category.id}
            href={`/templates?category=${category.name}`}
            className="group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {category.image}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-primary font-medium group-hover:underline">
                  Browse templates
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
