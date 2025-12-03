import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TemplateForm } from "@/app/components/form/TemplateForm";

async function getFormData() {
  const [styles, categories, tags] = await Promise.all([
    prisma.styleTag.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { styles, categories, tags };
}

export default async function NewTemplatePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  // Check if user is a creator
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeConnectedLinked: true },
  });

  if (!dbUser?.stripeConnectedLinked) {
    redirect("/billing?message=connect-stripe");
  }

  const { styles, categories, tags } = await getFormData();

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <p className="text-muted-foreground">
          Fill in the details below to submit your template for review
        </p>
      </div>

      <TemplateForm 
        styles={styles} 
        categories={categories} 
        tags={tags}
        mode="create"
      />
    </section>
  );
}

export const metadata = {
  title: "Create New Template | VibeBase",
  description: "Create a new template to sell on the marketplace",
};
