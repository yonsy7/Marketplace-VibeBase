import { requireAuth } from '@/app/lib/auth';
import { notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import { FileList } from '@/app/components/download/FileList';
import { DownloadButton } from '@/app/components/download/DownloadButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Download Template',
};

export default async function DownloadPage({ params }: { params: { orderId: string } }) {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      template: {
        include: {
          files: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Verify ownership
  if (order.buyerId !== user.id) {
    notFound();
  }

  // Verify download is available
  if (!order.downloadAvailable) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Download is not yet available. Please wait for payment confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Download Template</h1>
        <p className="text-muted-foreground mt-2">
          {order.template.title}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileList files={order.template.files} orderId={order.id} />
        </CardContent>
      </Card>

      {order.downloadCount > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Downloaded {order.downloadCount} {order.downloadCount === 1 ? 'time' : 'times'}
        </p>
      )}
    </div>
  );
}
