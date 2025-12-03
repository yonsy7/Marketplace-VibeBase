import { requireCreator } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateStatus } from "@prisma/client";

export default async function CreatorDashboardPage() {
  const { user } = await requireCreator();

  // Get creator stats
  const [
    totalTemplates,
    publishedTemplates,
    pendingTemplates,
    draftTemplates,
    totalSales,
    totalRevenue,
  ] = await Promise.all([
    prisma.template.count({
      where: { creatorId: user.id },
    }),
    prisma.template.count({
      where: { creatorId: user.id, status: TemplateStatus.PUBLISHED },
    }),
    prisma.template.count({
      where: { creatorId: user.id, status: TemplateStatus.PENDING },
    }),
    prisma.template.count({
      where: { creatorId: user.id, status: TemplateStatus.DRAFT },
    }),
    prisma.order.count({
      where: {
        template: { creatorId: user.id },
      },
    }),
    prisma.order.aggregate({
      where: {
        template: { creatorId: user.id },
      },
      _sum: {
        amount: true,
        platformFee: true,
      },
    }),
  ]);

  const netRevenue = (totalRevenue._sum.amount || 0) - (totalRevenue._sum.platformFee || 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(netRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Templates Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Published</span>
                <span className="font-bold">{publishedTemplates}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Review</span>
                <span className="font-bold">{pendingTemplates}</span>
              </div>
              <div className="flex justify-between">
                <span>Draft</span>
                <span className="font-bold">{draftTemplates}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
