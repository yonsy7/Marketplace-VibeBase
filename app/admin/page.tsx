import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriceTag } from "@/components/ui/price-tag";
import {
  DollarSign,
  FileCode,
  Users,
  AlertCircle,
  Check,
  X,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { TemplateStatusType } from "@/app/lib/classification";

async function getAdminStats() {
  noStore();

  const [
    totalTemplates,
    pendingTemplates,
    publishedTemplates,
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingList,
  ] = await Promise.all([
    prisma.template.count(),
    prisma.template.count({ where: { status: "PENDING" } }),
    prisma.template.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { platformFee: true } }),
    prisma.template.findMany({
      where: { status: "PENDING" },
      take: 10,
      orderBy: { createdAt: "asc" },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    totalTemplates,
    pendingTemplates,
    publishedTemplates,
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue._sum.platformFee || 0,
    pendingList,
  };
}

export default async function AdminDashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  // Check if user is admin (you would check the role in the database)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getAdminStats();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage templates and monitor marketplace activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalOrders} orders
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
              {stats.publishedTemplates} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingTemplates}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Templates Pending Review</CardTitle>
            <Link href="/admin/templates?status=PENDING">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.pendingList.length === 0 ? (
            <div className="text-center py-8">
              <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No templates pending review
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Template</th>
                    <th className="text-left py-3 px-4 font-medium">Creator</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.pendingList.map((template) => (
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
                        {template.creator.firstName} {template.creator.lastName}
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/templates/${template.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
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
  title: "Admin Dashboard | VibeBase",
  description: "Manage templates and monitor marketplace activity",
};
