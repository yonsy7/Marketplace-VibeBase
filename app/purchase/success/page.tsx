import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Purchase Successful',
};

export default function PurchaseSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Purchase Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase. Your template is ready to download.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You should receive an email with your download link shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/user/purchases">View My Purchases</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/templates">Browse More Templates</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
