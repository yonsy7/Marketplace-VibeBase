import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { Download, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

async function getPurchases(userId: string) {
  noStore();

  const purchases = await prisma.order.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      template: {
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          files: true,
        },
      },
    },
  });

  return purchases;
}

export default async function PurchasesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const purchases = await getPurchases(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          Templates you have purchased
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No purchases made</h3>
          <p className="text-muted-foreground mb-6">
            Explore our marketplace to find your first template
          </p>
          <Link href="/templates">
            <Button>Explore Templates</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {purchase.template.previewImages &&
                    (purchase.template.previewImages as string[])[0] ? (
                      <Image
                        src={(purchase.template.previewImages as string[])[0]}
                        alt={purchase.template.title}
                        width={192}
                        height={108}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No preview
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/templates/${purchase.template.slug}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {purchase.template.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          By {purchase.template.creator.firstName}{" "}
                          {purchase.template.creator.lastName}
                        </p>
                      </div>
                      <PriceTag price={purchase.amount} size="lg" />
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {purchase.template.shortDesc}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>
                        Purchased{" "}
                        {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                      </span>
                      <span>•</span>
                      <span>
                        Downloaded {purchase.downloadCount} time
                        {purchase.downloadCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {purchase.downloadAvailable &&
                        purchase.template.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        ))}
                      <Link href={`/templates/${purchase.template.slug}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Template
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export const metadata = {
  title: "My Purchases | VibeBase",
  description: "Your purchased templates",
};
