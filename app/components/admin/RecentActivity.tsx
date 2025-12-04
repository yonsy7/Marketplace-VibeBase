import prisma from '@/app/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export async function RecentActivity() {
  const recentTemplates = await prisma.template.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      creator: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTemplates.map((template) => (
            <div key={template.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{template.title}</p>
                <p className="text-xs text-muted-foreground">
                  by {template.creator.firstName} {template.creator.lastName} •{' '}
                  {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
