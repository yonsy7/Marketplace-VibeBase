import prisma from '@/app/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateStatus, UserRole } from '@prisma/client';
import { Package, Users, DollarSign, FileText } from 'lucide-react';

export async function GlobalStats() {
  const [
    templatesByStatus,
    totalSales,
    platformRevenue,
    userCounts,
  ] = await Promise.all([
    prisma.template.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.order.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      _sum: { platformFee: true },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
  ]);

  const pendingCount = templatesByStatus.find((s) => s.status === TemplateStatus.PENDING)?._count || 0;
  const publishedCount = templatesByStatus.find((s) => s.status === TemplateStatus.PUBLISHED)?._count || 0;
  const totalUsers = userCounts.reduce((sum, u) => sum + u._count, 0);
  const creatorCount = userCounts.find((u) => u.role === UserRole.CREATOR)?._count || 0;

  const stats = [
    {
      title: 'Pending Templates',
      value: pendingCount.toString(),
      icon: FileText,
      description: 'Awaiting review',
      variant: 'destructive' as const,
    },
    {
      title: 'Published Templates',
      value: publishedCount.toString(),
      icon: Package,
      description: 'Live on platform',
    },
    {
      title: 'Total Sales',
      value: totalSales._count?.toString() || '0',
      icon: DollarSign,
      description: `$${((totalSales._sum?.amount || 0) / 100).toLocaleString()}`,
    },
    {
      title: 'Platform Revenue',
      value: `$${((platformRevenue._sum?.platformFee || 0) / 100).toLocaleString()}`,
      icon: DollarSign,
      description: 'From commissions',
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      description: `${creatorCount} creators`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
