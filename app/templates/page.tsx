import { Suspense } from "react";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { TemplateCard } from "@/app/components/TemplateCard";
import { TemplateGridSkeleton } from "@/app/components/TemplateCardSkeleton";
import { StyleChips } from "@/app/components/StyleChips";
import { CategoryCards } from "@/app/components/CategoryCards";
import { PlatformIcons } from "@/app/components/PlatformIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Style, TechStackType } from "@/app/lib/classification";

interface SearchParams {
  style?: string;
  category?: string;
  platform?: string;
  techStack?: string;
  sort?: string;
  page?: string;
}

async function getTemplates(searchParams: SearchParams) {
  noStore();

  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    status: "PUBLISHED",
  };

  if (searchParams.style) {
    where.styles = {
      some: {
        style: {
          slug: searchParams.style,
        },
      },
    };
  }

  if (searchParams.category) {
    where.categories = {
      some: {
        category: {
          slug: searchParams.category,
        },
      },
    };
  }

  if (searchParams.platform) {
    where.platforms = {
      some: {
        platform: searchParams.platform,
      },
    };
  }

  if (searchParams.techStack) {
    where.techStack = searchParams.techStack;
  }

  // Build order by
  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "popular") {
    orderBy = { viewCount: "desc" };
  } else if (searchParams.sort === "rating") {
    orderBy = { ratingAverage: "desc" };
  } else if (searchParams.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (searchParams.sort === "price-desc") {
    orderBy = { price: "desc" };
  }

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        styles: {
          include: {
            style: true,
          },
        },
      },
    }),
    prisma.template.count({ where }),
  ]);

  return {
    templates,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

function ActiveFilters({ searchParams }: { searchParams: SearchParams }) {
  const filters = [];
  if (searchParams.style) filters.push({ key: "style", value: searchParams.style });
  if (searchParams.category) filters.push({ key: "category", value: searchParams.category });
  if (searchParams.platform) filters.push({ key: "platform", value: searchParams.platform });
  if (searchParams.techStack) filters.push({ key: "techStack", value: searchParams.techStack });

  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1">
          {filter.value}
          <Link
            href={`/templates?${new URLSearchParams(
              Object.fromEntries(
                Object.entries(searchParams).filter(([k]) => k !== filter.key)
              )
            ).toString()}`}
          >
            <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
          </Link>
        </Badge>
      ))}
      {filters.length > 1 && (
        <Link href="/templates">
          <Button variant="ghost" size="sm">
            Clear all
          </Button>
        </Link>
      )}
    </div>
  );
}

async function TemplatesGrid({ searchParams }: { searchParams: SearchParams }) {
  const { templates, total, page, totalPages } = await getTemplates(searchParams);

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No templates found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or browse all templates
        </p>
        <Link href="/templates">
          <Button>View all templates</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {templates.length} of {total} templates
        </p>
        <div className="flex items-center gap-2">
          <Select defaultValue={searchParams.sort || "newest"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            slug={template.slug}
            title={template.title}
            shortDesc={template.shortDesc}
            price={template.price}
            images={
              template.previewImages
                ? (template.previewImages as string[])
                : []
            }
            styles={template.styles.map((s) => s.style.slug as Style)}
            techStack={template.techStack as TechStackType}
            ratingAverage={template.ratingAverage}
            ratingCount={template.ratingCount}
            likeCount={template.likeCount}
            viewCount={template.viewCount}
            creatorName={`${template.creator.firstName} ${template.creator.lastName}`}
            creatorImage={template.creator.profileImage}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/templates?${new URLSearchParams({
                ...searchParams,
                page: String(page - 1),
              }).toString()}`}
            >
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/templates?${new URLSearchParams({
                ...searchParams,
                page: String(page + 1),
              }).toString()}`}
            >
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Templates</h1>
        <p className="text-muted-foreground">
          Discover AI-ready templates for your next project
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="font-medium">Filters</span>
          </div>
        </div>

        <StyleChips />
        <Separator />
        <ActiveFilters searchParams={searchParams} />
      </div>

      {/* Templates Grid */}
      <Suspense fallback={<TemplateGridSkeleton count={12} />}>
        <TemplatesGrid searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

export const metadata = {
  title: "Explore Templates | VibeBase",
  description:
    "Discover AI-ready design templates for your next project. Browse by style, category, or platform.",
};
