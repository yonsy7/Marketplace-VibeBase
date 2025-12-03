# Écarts fonctionnels – Marketplace IA V1 vs code actuel

Cette note compare le PRD "AI-Ready Design Templates" (templates HTML/React/Next.js, IA-first) avec l'implémentation existante décrite dans `TECHNICAL_DOCUMENTATION.md`. Les observations ci-dessous pointent uniquement les fonctionnalités manquantes ou incomplètes qui doivent être comblées pour atteindre le périmètre V1.

## 1. Modèle de données & backend

### 1.1 Absence du modèle Template complet (slug, statuts, métadonnées IA)
Le schéma Prisma actuel ne contient que `User` et `Product` avec un enum `CategoryTypes`. On ne retrouve ni `TemplateStatus`, ni `TechStack`, ni `PlatformType`, ni les tables de jonction décrites dans le PRD (styles, catégories, sous-catégories, tags, plateformes, TemplateFile, TemplatePlatform, Order, Review, Favorite, etc.).

```
11:42:prisma/schema.prisma
model User {
  id                    String  @id @unique
  email                 String
  firstName             String
  lastName              String
  profileImage          String
  connectedAccountId    String  @unique
  stripeConnectedLinked Boolean @default(false)

  Product Product[]
}

model Product {
  id               String        @id @default(uuid())
  name             String
  price            Int
  smallDescription String
  description      Json
  images           String[]
  productFile      String
  category         CategoryTypes

  createdAt DateTime @default(now())
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?
}

enum CategoryTypes {
  template
  uikit
  icon
}
```

**Écarts majeurs**
- Pas de slug unique (`/templates/[slug]`), ni d'horodatage `updatedAt`, ni de champs `ratingAverage`, `ratingCount`, `likeCount`, `previewFileId`, `previewImages`, `liveDemoUrl`, `techStack`, `status`.
- Aucune structure pour les 3 catégories max, 5 styles, 6 sous-catégories ou tags libres.
- Aucun stockage des plateformes IA compatibles ou des fichiers multiples (HTML vs ZIP).
- Aucun modèle `Order`, `Review`, `Favorite` pour implémenter achats, avis, likes, téléchargements sécurisés.
- Pas de modèle `TemplatePlatform`, `TemplateStyleTag`, etc. mentionnés dans le PRD.

### 1.2 Workflow de publication et modération inexistant
Le server action `SellProduct` écrit directement dans la table `Product` sans notion de brouillon, de statut `PENDING`, ni de route admin pour valider/rejeter. Aucune logique pour repasser un template publié en pending lors d'une édition.

```
47:89:app/actions.ts
export async function SellProduct(prevState: any, formData: FormData) {
  ...
  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productFile: formData.get("productFile"),
  });
  ...
  const data = await prisma.product.create({
    data: {
      name: validateFields.data.name,
      category: validateFields.data.category as CategoryTypes,
      ...
    },
  });

  return redirect(`/product/${data.id}`);
}
```

### 1.3 Données transactionnelles et permissions
- Aucun enregistrement d'achat (`Order`) n'est créé au moment du checkout, empêchant de conditionner l'accès aux téléchargements ou aux reviews.
- Aucun champ/permission pour calculer les ventes, les revenus cumulés, les likes ou les notes qui alimentent les dashboards (acheteurs, créateurs, admin).

### 1.4 Emails et notifications incomplets
Le webhook Stripe envoie systématiquement un email à `"your_email"` et ne personnalise pas le destinataire ni le contenu par template, ce qui ne correspond pas aux exigences de distribution post-achat.

```
26:41:app/api/stripe/route.ts
case "checkout.session.completed": {
  const session = event.data.object;
  const link = session.metadata?.link;
  const { data, error } = await resend.emails.send({
    from: "MarshalUI <onboarding@resend.dev>",
    to: ["your_email"],
    subject: "Your Product from MarshalUI",
    react: ProductEmail({ link: link as string }),
  });
  break;
}
```

### 1.5 Gestion des fichiers
UploadThing ne permet que le téléversement d'images (préviews) et d'un seul fichier ZIP, ce qui ne couvre pas les exigences V1 : fichiers HTML multiples avec sélection d'un `previewFile`, support différencié pour ZIP Vite/Next.js, assets additionnels, validations d'URL de live demo.

```
10:52:app/api/uploadthing/core.ts
imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
...
productFileUpload: f({ "application/zip": { maxFileCount: 1 } })
```

## 2. Expérience acheteur

### 2.1 Page d'accueil sans AI Template Finder ni sections PRD
Le hero actuel se limite à un slogan générique et à 4 sections "ProductRow" (nouveautés, templates, icons, UI kits). Il n'y a ni textarea IA, ni bouton "Trouver mes templates" connecté à `/api/ai/suggest-templates`, ni blocs "Popular styles", "Categories", "IA Platforms", "Popular templates", "New arrivals" ou "Featured creators".

```
3:19:app/page.tsx
export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="max-w-3xl ...">
        <h1>Find the best Tailwind</h1>
        <h1 className="text-primary">Templates & Icons</h1>
        <p>MarshalUi stands out...</p>
      </div>
      <ProductRow category="newest" />
      <ProductRow category="templates" />
      <ProductRow category="icons" />
      <ProductRow category="uikits" />
    </section>
  );
}
```

### 2.2 Parcours d'exploration réduit à 3 catégories
Le "catalogue" repose sur le paramètre `/products/[category]` et affiche simplement une grille de cartes sans filtres, tri, tags, plateformes IA, pagination ni mode multi-sélection. Les catégories disponibles sont limitées à `template`, `uikit`, `icon` (cf. `app/lib/categroyItems.tsx`).

```
7:31:app/lib/categroyItems.tsx
export const categoryItems = [
  { id: 0, name: "template", title: "Template" },
  { id: 1, name: "uikit", title: "Ui Kit" },
  { id: 2, name: "icon", title: "Icon" },
];
```

```
1:70:app/products/[category]/page.tsx
const data = await prisma.product.findMany({ where: { category: input } });
...
<div className="grid ...">
  {data.map((product) => (
    <ProductCard key={product.id} ... />
  ))}
</div>
```

### 2.3 Fiche template minimaliste
La page `/product/[id]` ne montre que le carrousel d'images, un résumé, la date de publication et la catégorie. Il manque :
- Byline, badges de styles, catégories/sous-catégories multiples, tags, stack, plateformes IA.
- Prévisualisation HTML/iframe, bouton "Open live demo" pour Vite/Next.
- Compteurs (likes, reviews, ventes), CTA favoris, section reviews, "More from this creator", "Similar templates".
- Affichage d'un prix "Free" lorsque price=0.

```
18:107:app/product/[id]/page.tsx
const data = await prisma.product.findUnique({ select: { category, ... } });
...
<ProductDescription content={data?.description as JSONContent} />
```

### 2.4 Cartes produit incomplètes
`ProductCard` affiche uniquement image, nom, prix, court résumé. Les cartes devraient inclure style principal, catégories clés, stack, plateformes compatibles, rating moyen, likes, etc.

```
21:63:app/components/ProductCard.tsx
<h1 className="font-semibold text-xl">{name}</h1>
<h3 className="...">${price}</h3>
<p className="...">{smallDescription}</p>
<Button asChild><Link href={`/product/${id}`}>Learn More!</Link></Button>
```

### 2.5 Recherche et recommandations IA absentes
Aucun composant ne consomme `/api/ai/suggest-templates` et l'API elle-même n'existe pas dans `app/api`. Pas d'embeddings, pas de scoring, pas de fallback "Popular templates".

### 2.6 Favoris, likes, reviews, téléchargements sécurisés
- Aucun modèle ni UI pour liker/unliker un template ou afficher "favorites".
- Aucune page `/user/favorites`.
- Pas de système de reviews, ni de pagination, ni de restriction basée sur une commande.
- Pas de page `/download/[orderId]` pour sécuriser l'accès aux fichiers achetés.

## 3. Parcours achat & post-achat

### 3.1 Checkout sans ordres persistés
`BuyProduct` se contente de créer une session de paiement Stripe et redirige vers Checkout, sans créer d'entrée `Order`, ni activer `downloadAvailable`, ni stocker `paymentIntentId` comme décrit dans le PRD.

```
132:189:app/actions.ts
export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique(...);
  const session = await stripe.checkout.sessions.create({
    line_items: [...],
    metadata: { link: data?.productFile as string },
    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
      transfer_data: { destination: data?.User?.connectedAccountId as string },
    },
    success_url: .../payment/success,
    cancel_url: .../payment/cancel,
  });
  return redirect(session.url as string);
}
```

### 3.2 Routes post-achat divergentes
Le PRD attend `/purchase/success`, `/purchase/cancel`, `/download/[orderId]`. Le code ne fournit que `/payment/success` et `/payment/cancel`, sans logique d'autorisation ni lien de téléchargement.

```
6:30:app/payment/success/page.tsx
<section ...>
  <Card>Payment Successful ... "Back to Homepage"</Card>
</section>
```

### 3.3 Favoris et likes
Aucun composant n'expose un bouton "Add to favorites" / "Remove from favorites" ou un compteur de likes, faute de modèle `Favorite` et d'API associée.

## 4. Expérience créateur

### 4.1 Formulaire "New Template" incomplet
`SellForm` n'embarque qu'un champ `name`, une sélection mono-catégorie, un prix, un court descriptif, une description TipTap, un upload d'images et un upload unique de ZIP. Il manque l'intégralité des sections définies dans le PRD (visuels min/max, multi-sélection catégories/styles/sous-catégories, tags chips, stack radio, plateformes IA, fichiers dépendants du stack, toggle Paid/Free, champ price conditionnel, rich text "Full description", actions Save as Draft/Publish).

```
47:155:app/components/form/Sellform.tsx
<Label>Category</Label>
<SelectCategory />
...
<UploadDropzone endpoint="imageUploader" ... />
...
<UploadDropzone endpoint="productFileUpload" ... />
```

### 4.2 Absence de dashboards créateur
- Pas de `/creator/dashboard`, `/creator/templates`, `/creator/templates/new`, `/creator/templates/[id]/edit`, `/creator/profile` comme défini par l'arborescence PRD.
- Navigation utilisateur limitée à "Sell your Product", "Settings", "My Products", "Billing" (aucun accès aux nouvelles sections).

```
43:58:app/components/UserNav.tsx
<DropdownMenuItem asChild>
  <Link href="/sell">Sell your Product</Link>
</DropdownMenuItem>
<DropdownMenuItem asChild>
  <Link href="my-products">My Products</Link>
</DropdownMenuItem>
```

- "My Products" liste simplement les cards sans stats (vues, ventes, rating, likes) ni statuts (Draft/Pending/Published/Rejected).
- Aucun écran d'édition (`/creator/templates/[id]/edit`).

### 4.3 Stripe Connect vs plateformes IA
La page `/billing` se limite à créer un account link ou à ouvrir le dashboard Stripe. Aucun lien avec la sélection de plateformes IA, ni intégration Stripe Connect dans la page profil créateur.

## 5. Admin & modération

- Aucune route `/admin`, aucune vue listant les templates en `PENDING`, aucun bouton Approve/Reject, aucune gestion des reviews abusives.
- Pas de statistiques globales (nb templates par statut, nb ventes, top templates) comme exigé.

## 6. IA & recherche intelligente

- Pas d'endpoint `/api/ai/suggest-templates`, ni d'intégration à un service d'embeddings, ni de reranking par rating/likes/ventes.
- Aucun stockage des données nécessaires au prompt (styles, catégories hiérarchiques, tags, plateformes, stack).

## 7. Synthèse des chantiers à prévoir

1. **Refonte du schéma Prisma** pour introduire tout le modèle Template/Orders/Favorites/Reviews/Platforms/Tags/Statuses décrit par le PRD.
2. **Nouveaux parcours UI**: home IA avec textarea + sections, `/templates` explorer complet, `/templates/[slug]` détaillé avec preview, favoris, reviews, similar/more-from-creator.
3. **Workflow créateur**: formulaire multi-sections, statuts Draft/Pending, dashboard, édition, profil public, intégration plateformes IA.
4. **Layer IA & recherche**: endpoint `/api/ai/suggest-templates`, stockage des métadonnées, logique embeddings + reranking, UI de résultats et fallback.
5. **Post-achat & fidélisation**: commandes persistées, page download sécurisée, favoris/likes, reviews notées, pages `/user/favorites` et sections cross-sell.
6. **Outils admin**: dashboards, approbation/rejet, modération des reviews, monitoring stats globales.

Sans ces ajouts structurels, l'application reste un marketplace générique et ne couvre pas le périmètre "AI-Ready Marketplace" décrit dans le PRD V1.
