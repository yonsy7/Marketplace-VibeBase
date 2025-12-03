import { requireCreator } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function NewTemplatePage() {
  const { user } = await requireCreator();

  // TODO: Créer le formulaire complet de création de template
  // Pour l'instant, rediriger vers une page de placeholder
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Template</h1>
      <p className="text-muted-foreground">
        Template creation form coming soon. This will include all classification options,
        file uploads, and pricing configuration.
      </p>
    </div>
  );
}
