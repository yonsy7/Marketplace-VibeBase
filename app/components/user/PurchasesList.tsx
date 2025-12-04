import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { TemplateCard } from '@/app/components/TemplateCard';

interface PurchasesListProps {
  orders: Array<{
    id: string;
    amount: number;
    downloadCount: number;
    createdAt: Date;
    template: any;
  }>;
}

export function PurchasesList({ orders }: PurchasesListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Download className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
        <p className="text-muted-foreground mb-4">
          Start exploring and purchasing templates
        </p>
        <Button asChild>
          <a href="/templates">Browse Templates</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <TemplateCard template={order.template} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Purchased {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span>{formatPrice(order.amount)}</span>
                  {order.downloadCount > 0 && (
                    <>
                      <span>•</span>
                      <span>Downloaded {order.downloadCount} {order.downloadCount === 1 ? 'time' : 'times'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href={`/download/${order.id}`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/templates/${order.template.slug}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Template
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
