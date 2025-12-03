import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriceTag } from "@/components/ui/price-tag";
import {
  DollarSign,
  Download,
  Heart,
  Star,
  Eye,
  FileCode,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { TemplateStatusType } from "@/app/lib/classification";

async function getCreatorStats(userId: string) {
  noStore();

  const templates = await prisma.template.findMany({
    where: { creatorId: userId },
    include: {
      orders: true,
      reviews: true,
    },
  });

  const totalTemplates = templates.length;
  const publishedTemplates = templates.filter(
    (t) => t.status === "PUBLISHED"
  ).length;
  const pendingTemplates = templates.filter(
    (t) => t.status === "PENDING"
  ).length;

  const totalSales = templates.reduce(
    (acc, t) => acc + t.orders.length,
    0
  );
  
  const totalRevenue = templates.reduce(
    (acc, t) => acc + t.orders.reduce((sum, o) => sum + o.amount, 0),
    0
  );

  const totalLikes = templates.reduce((acc, t) => acc + t.likeCount, 0);
  const totalViews = templates.reduce((acc, t) => acc + t.viewCount, 0);

  const allRatings = templates.flatMap((t) =>
    t.reviews.map((r) => r.rating)
  );
  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 0;

  return {
    totalTemplates,
    publishedTemplates,
    pendingTemplates,
    totalSales,
    totalRevenue,
    totalLikes,
    totalViews,
    averageRating,
    templates,
  };
}

export default async function CreatorDashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const stats = await getCreatorStats(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your templates and track your performance
          </p>
        </div>
        <Link href="/creator/templates/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalSales} sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedTemplates} published, {stats.pendingTemplates} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Across all templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalViews} total views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Templates</CardTitle>
            <Link href="/creator/templates">
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.templates.length === 0 ? (
            <div className="text-center py-8">
              <FileCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating your first template to sell on the marketplace
              </p>
              <Link href="/creator/templates/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Template</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Sales</th>
                    <th className="text-left py-3 px-4 font-medium">Views</th>
                    <th className="text-left py-3 px-4 font-medium">Likes</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.templates.slice(0, 5).map((template) => (
                    <tr key={template.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium line-clamp-1">
                            {template.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {template.shortDesc}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={template.status as TemplateStatusType}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <PriceTag price={template.price} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {template.orders.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {template.viewCount}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          {template.likeCount}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/templates/${template.slug}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/creator/templates/${template.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export const metadata = {
  title: "Creator Dashboard | VibeBase",
  description: "Manage your templates and track your performance",
};
