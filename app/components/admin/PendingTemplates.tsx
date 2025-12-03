import prisma from '@/app/lib/db';
import { TemplateStatus } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Eye, Check, X } from 'lucide-react';

export async function PendingTemplates() {
  const pendingTemplates = await prisma.template.findMany({
    where: {
      status: TemplateStatus.PENDING,
    },
    include: {
      creator: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Templates</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTemplates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending templates
          </p>
        ) : (
          <div className="space-y-3">
            {pendingTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/admin/templates/${template.id}`}
                      className="font-medium hover:underline"
                    >
                      {template.title}
                    </Link>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {template.creator.firstName} {template.creator.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/templates/${template.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/templates?status=PENDING">View all pending</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
