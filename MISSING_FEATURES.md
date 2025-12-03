# 🔍 Analyse Approfondie des Fonctionnalités Manquantes

## PRD V1 Marketplace - AI-Ready Design Templates

**Document de référence** : PRD V1 Marketplace pour templates HTML/React/Next.js AI-Ready

**État actuel** : Marketplace générique de templates Tailwind CSS (MarshalUI)

**Date d'analyse** : 3 décembre 2024

---

## 📊 Résumé Exécutif

| Catégorie | Implémenté | À Développer | Progression |
|-----------|------------|--------------|-------------|
| Modèle de données | ~20% | ~80% | 🔴 |
| Page d'accueil | ~10% | ~90% | 🔴 |
| Explorer/Filtres | ~10% | ~90% | 🔴 |
| Page Template | ~30% | ~70% | 🟡 |
| Espace Créateur | ~15% | ~85% | 🔴 |
| Espace Admin | 0% | 100% | 🔴 |
| IA/Recommandation | 0% | 100% | 🔴 |
| Reviews & Favoris | 0% | 100% | 🔴 |
| Sécurité & Performance | ~30% | ~70% | 🟡 |
| SEO & Branding | ~10% | ~90% | 🔴 |
| UX/Accessibilité | ~20% | ~80% | 🔴 |

---

## 🗃️ 1. Modèle de Données (Prisma)

### 1.1 Modèles Existants vs Requis

#### ✅ Modèles Existants (partiels)

| Modèle | État | Commentaire |
|--------|------|-------------|
| `User` | Partiel | Manque: `username`, `bio`, `role (UserRole)` |
| `Product` | Partiel | Doit devenir `Template` avec nombreux champs supplémentaires |

#### ❌ Modèles Manquants

| Modèle | Priorité | Description |
|--------|----------|-------------|
| `Template` | P0 | Refonte complète du modèle Product |
| `TemplateFile` | P0 | Gestion des fichiers uploadés (HTML, ZIP, assets) |
| `StyleTag` | P0 | Tags de styles visuels (clean-minimal, dark-saas...) |
| `TemplateStyleTag` | P0 | Relation many-to-many Template ↔ Style |
| `Category` | P0 | Catégories principales (3 catégories PRD) |
| `Subcategory` | P0 | Sous-catégories (liées aux catégories) |
| `TemplateCategory` | P0 | Relation many-to-many Template ↔ Category |
| `TemplateSubcategory` | P0 | Relation many-to-many Template ↔ Subcategory |
| `Tag` | P1 | Tags libres/semi-contrôlés |
| `TemplateTag` | P1 | Relation many-to-many Template ↔ Tag |
| `TemplatePlatform` | P0 | Plateformes IA compatibles |
| `Order` | P0 | Historique des commandes avec `downloadAvailable` |
| `Review` | P1 | Avis et notes (unique par user/template) |
| `Favorite` | P1 | Favoris utilisateur (unique par user/template) |
| `TemplateView` | P2 | Comptage des vues (optionnel) |

### 1.2 Enums Manquants

```prisma
// ❌ À créer
enum TemplateStatus {
  DRAFT
  PENDING
  PUBLISHED
  REJECTED
}

enum TechStack {
  HTML
  REACT_VITE
  NEXTJS
}

enum FileType {
  HTML
  PROJECT_ZIP
  CSS
  JS
  ASSET
}

enum PlatformType {
  V0
  LOVABLE
  SUBFRAME
  MAGIC_PATTERNS
  UIZARD
  ONLOOK
  REPLIT
  AURA_BUILD
  MAGIC_PATH
  STITCH
}

enum UserRole {
  USER
  CREATOR
  ADMIN
}
```

### 1.3 Champs Manquants sur User

| Champ | Type | Description | Priorité |
|-------|------|-------------|----------|
| `username` | String @unique | Nom d'utilisateur public | P0 |
| `bio` | String? | Biographie courte | P1 |
| `role` | UserRole | Rôle utilisateur (USER, CREATOR, ADMIN) | P0 |
| `avatarUrl` | String? | URL avatar (renommer `profileImage`) | P1 |

### 1.4 Transformation Product → Template

| Champ Existant | Transformation | Nouveau Champ |
|----------------|----------------|---------------|
| `id` | Conserver | `id` |
| `name` | Renommer | `title` |
| `smallDescription` | Renommer | `shortDesc` |
| `description` (Json) | Renommer | `longDesc` |
| `price` (Int) | Conserver | `price` (cents) |
| `images` (String[]) | → | `previewImages` (Json) |
| `category` | Supprimer | Via `TemplateCategory` relation |
| `productFile` | Supprimer | Via `TemplateFile` relation |
| `createdAt` | Conserver | `createdAt` |
| `userId` | Renommer | `creatorId` |
| - | **Ajouter** | `slug` (String @unique) |
| - | **Ajouter** | `byline` (String?) |
| - | **Ajouter** | `status` (TemplateStatus) |
| - | **Ajouter** | `techStack` (TechStack) |
| - | **Ajouter** | `previewFileId` (String?) |
| - | **Ajouter** | `liveDemoUrl` (String?) |
| - | **Ajouter** | `ratingAverage` (Float @default(0)) |
| - | **Ajouter** | `ratingCount` (Int @default(0)) |
| - | **Ajouter** | `likeCount` (Int @default(0)) |
| - | **Ajouter** | `viewCount` (Int @default(0)) |
| - | **Ajouter** | `updatedAt` (DateTime @updatedAt) |

---

## 🏠 2. Page d'Accueil (Home)

### 2.1 État Actuel

```
✅ Hero text simple statique
✅ ProductRow par catégorie (newest, templates, icons, uikits)
✅ Suspense avec skeleton loading
❌ Pas de recherche IA
❌ Pas de styles populaires
❌ Catégories ne correspondent pas au PRD
❌ Pas de plateformes IA
❌ Pas de créateurs mis en avant
```

### 2.2 Fonctionnalités Manquantes

#### ❌ Bloc 1 — AI Template Finder (Hero) [P0]

| Élément | État | Description |
|---------|------|-------------|
| Textarea IA fullwidth | ❌ | Placeholder: "Décris ton besoin : 'Landing SaaS dark en Next.js'..." |
| Bouton "Trouver mes templates" | ❌ | POST vers /api/ai/suggest-templates |
| Affichage résultats IA (3-6 cartes) | ❌ | Avec score, explication, match reason |
| État loading | ❌ | Skeletons de cartes animées |
| État erreur | ❌ | Message + fallback "Templates populaires" |
| État aucun résultat | ❌ | Message + suggestions élargies |
| Animation de transition | ❌ | Fade in des résultats |

#### ❌ Bloc 2 — Styles populaires [P0]

| Élément | État | Description |
|---------|------|-------------|
| Titre "Popular styles" | ❌ | |
| Chips de styles cliquables | ❌ | 14 styles du PRD |
| Navigation vers /templates?style=X | ❌ | Query params |
| Scroll horizontal sur mobile | ❌ | |

**Liste des 14 styles PRD :**
```
clean-minimal, dark-saas, pastel-playful, cyberpunk,
neo-brutalism, editorial-magazine, rounded-soft,
warm-organic, gradient-fusion, retro-90s, futuristic-ui,
dashboard-modern, mobile-first, geometric-tech
```

#### ❌ Bloc 3 — Catégories [P0]

| Élément | État | Description |
|---------|------|-------------|
| 3 grandes cartes catégories | ❌ | Remplacer les 3 actuelles |
| Marketing & Landing | ❌ | Icône + description + CTA |
| Product & App UI | ❌ | Icône + description + CTA |
| Dashboard & Analytics | ❌ | Icône + description + CTA |
| Navigation vers /templates?category=X | ❌ | |

**Catégories actuelles à supprimer :** `template`, `uikit`, `icon`

#### ❌ Bloc 4 — Plateformes IA [P0]

| Élément | État | Description |
|---------|------|-------------|
| Bande d'icônes cliquables | ❌ | 10+ plateformes |
| v0.dev | ❌ | |
| Lovable | ❌ | |
| Subframe | ❌ | |
| Magic Patterns | ❌ | |
| Uizard | ❌ | |
| Onlook | ❌ | |
| Replit Design Mode | ❌ | |
| Aura.build | ❌ | |
| MagicPath | ❌ | |
| Stitch | ❌ | |
| Navigation vers /templates?platform=X | ❌ | |

#### ❌ Bloc 5 — Templates populaires [P1]

| Élément | État | Description |
|---------|------|-------------|
| Titre "Popular templates" | ❌ | |
| Algorithme de scoring | ❌ | ventes + likes + vues + rating |
| 4-8 templates | ❌ | |

#### ❌ Bloc 6 — Nouveaux templates [P1]

| Élément | État | Description |
|---------|------|-------------|
| Titre "New arrivals" | ❌ | |
| 4-8 derniers templates | ❌ | Filtrés par status = PUBLISHED |
| Badge "New" | ❌ | Si < 7 jours |

#### ❌ Bloc 7 — Créateurs mis en avant (optionnel V1) [P2]

| Élément | État | Description |
|---------|------|-------------|
| 2-4 profils créateurs | ❌ | |
| Avatar + nom + bio | ❌ | |
| Stats: nb templates, rating moyen | ❌ | |
| Lien vers /creator/[username] | ❌ | |

---

## 🔎 3. Explorer /templates

### 3.1 État Actuel

```
✅ Page /products/[category] simple
✅ Grille de ProductCard
❌ Route incorrecte (devrait être /templates)
❌ Pas de filtres avancés
❌ Pas de tri
❌ Pas de pagination/infinite scroll
❌ Pas de comptage de résultats
❌ Pas d'URL avec query params
```

### 3.2 Fonctionnalités Manquantes

#### ❌ Nouvelle route /templates [P0]

Remplacer `/products/[category]` par `/templates` avec query params.

#### ❌ Barre de filtres [P0]

| Filtre | État | Type | Multi-select |
|--------|------|------|--------------|
| Styles | ❌ | Chips/Dropdown | ✅ |
| Catégories | ❌ | Checkbox | ✅ |
| Sous-catégories | ❌ | Checkbox (filtré par catégories) | ✅ |
| Tags | ❌ | Search + chips | ✅ |
| Tech Stack | ❌ | Radio/Tabs | ❌ |
| IA Platforms | ❌ | Checkbox | ✅ |
| Prix | ❌ | Toggle Free/Paid + Range slider | - |
| Clear all filters | ❌ | Bouton | - |
| Compteur de filtres actifs | ❌ | Badge | - |

#### ❌ Options de tri [P0]

| Option | État | Champ de tri |
|--------|------|--------------|
| Récent | ❌ | `createdAt DESC` |
| Populaire | ❌ | Score combiné (ventes + likes + vues) |
| Prix croissant | ❌ | `price ASC` |
| Prix décroissant | ❌ | `price DESC` |
| Meilleure note | ❌ | `ratingAverage DESC` |
| Plus likés | ❌ | `likeCount DESC` |

#### ❌ Affichage [P1]

| Élément | État |
|---------|------|
| Compteur total de résultats | ❌ |
| Pagination (page numbers) | ❌ |
| Infinite scroll (alternative) | ❌ |
| URL synchronisée avec query params | ❌ |
| État vide (aucun résultat) | ❌ |
| Skeleton loading | ❌ |
| Toggle vue grille/liste | ❌ (optionnel) |

#### ❌ URL Query Params [P0]

```
/templates?style=dark-saas,clean-minimal
         &category=marketing-landing
         &subcategory=saas,pricing
         &tag=auth,dashboard
         &stack=NEXTJS
         &platform=V0,LOVABLE
         &price=free|paid|0-50
         &sort=popular
         &page=1
```

---

## 📄 4. Page Template /templates/[slug]

### 4.1 État Actuel

```
✅ Carousel d'images (Embla)
✅ Nom, prix, description courte
✅ Description longue (TipTap read-only)
✅ Bouton Buy (Stripe Checkout)
✅ Infos créateur basiques (avatar, prénom)
✅ Date de création
✅ Catégorie affichée
❌ Utilise /product/[id] au lieu de /templates/[slug]
❌ Pas de slug (UUID exposé)
❌ Pas de styles
❌ Pas de sous-catégories
❌ Pas de tags
❌ Pas de tech stack
❌ Pas de plateformes IA
❌ Pas de rating/reviews
❌ Pas de likes/favoris
❌ Pas de preview conditionnelle
```

### 4.2 Fonctionnalités Manquantes

#### ❌ Changement de route [P0]

| Actuel | Cible |
|--------|-------|
| `/product/[id]` | `/templates/[slug]` |

#### ❌ Header enrichi [P0]

| Élément | État | Description |
|---------|------|-------------|
| Slug dans URL | ❌ | `dark-saas-nextjs-starter` au lieu de UUID |
| Byline | ❌ | Sous-titre optionnel ("Best Agency Template") |
| Styles (badges) | ❌ | Jusqu'à 5 badges cliquables |
| Catégories | ❌ | Jusqu'à 3 badges cliquables |
| Sous-catégories | ❌ | Jusqu'à 6 badges cliquables |
| Tags | ❌ | Liste de chips cliquables |
| Tech stack badge | ❌ | Badge HTML / React Vite / Next.js |
| Plateformes IA (icônes) | ❌ | Icônes des plateformes compatibles |
| Rating moyen + nb reviews | ❌ | ★ 4.5 (23 reviews) |
| Nombre de likes | ❌ | ❤️ 45 favorites |
| Lien vers page créateur | ❌ | /creator/[username] cliquable |
| Badge "Free" si prix = 0 | ❌ | |
| Badge statut (pour créateur/admin) | ❌ | DRAFT/PENDING/PUBLISHED/REJECTED |

#### ❌ Preview conditionnelle [P0]

| Tech Stack | Type de Preview | État |
|------------|-----------------|------|
| HTML | iframe sandbox avec fichier HTML preview | ❌ |
| React Vite | iframe sur `liveDemoUrl` | ❌ |
| Next.js | iframe sur `liveDemoUrl` + bouton "Open live demo" | ❌ |
| Fallback | Message "No preview available" | ❌ |

**Logique :**
```typescript
if (techStack === 'HTML' && previewFileId) {
  // Afficher iframe sandbox avec le fichier HTML
} else if ((techStack === 'REACT_VITE' || techStack === 'NEXTJS') && liveDemoUrl) {
  // Afficher iframe avec liveDemoUrl
} else {
  // Fallback: premier screenshot du carousel
}
```

#### ❌ Likes / Favoris [P1]

| Élément | État | Description |
|---------|------|-------------|
| Bouton toggle like | ❌ | "❤️ Add to favorites" / "💔 Remove" |
| Compteur de favoris | ❌ | "XXX favorites" |
| Optimistic UI update | ❌ | Mise à jour instantanée avant réponse serveur |
| Authentification requise | ❌ | Redirect vers login si non connecté |

#### ❌ Reviews & Ratings [P1]

| Élément | État | Description |
|---------|------|-------------|
| Sommaire rating | ❌ | Moyenne ★ 1-5 + nombre de reviews |
| Distribution des notes | ❌ | Barres de progression 5★/4★/3★/2★/1★ |
| Liste des reviews | ❌ | Nom user, rating, texte, date |
| Pagination reviews | ❌ | Lazy load ou pagination |
| Formulaire ajout review | ❌ | Rating (1-5) + commentaire (optionnel) |
| Édition review | ❌ | Si l'user a déjà posté une review |
| Restriction: acheteurs uniquement | ❌ | Vérifier Order existant |
| 1 review par user/template | ❌ | Contrainte unique |
| Dates relatives | ❌ | "il y a 2 jours" |

#### ❌ Cross-selling [P2]

| Élément | État |
|---------|------|
| Section "More from this creator" | ❌ |
| Section "Similar templates" | ❌ (basé sur styles/catégories) |

#### ❌ Contenu enrichi [P1]

| Élément | État |
|---------|------|
| Liste des fichiers inclus | ❌ |
| Taille du téléchargement | ❌ |
| Dernière mise à jour | ❌ |
| Nombre de téléchargements | ❌ (optionnel) |

---

## 💳 5. Paiement & Téléchargement

### 5.1 État Actuel

```
✅ Stripe Checkout avec Connect
✅ Pages success/cancel basiques
✅ Email avec lien de téléchargement (Resend)
✅ Webhook checkout.session.completed
✅ Webhook account.updated
⚠️ Email envoyé à adresse hardcodée "your_email"
❌ Pas de modèle Order en BDD
❌ Pas de page de téléchargement sécurisée
❌ Pas d'historique des achats
❌ Pas de gestion des templates gratuits
```

### 5.2 Bugs/Issues Identifiés

#### 🐛 Email hardcodé dans webhook Stripe

```typescript
// app/api/stripe/route.ts ligne 33
to: ["your_email"], // ❌ Devrait être session.customer_email
```

**Fix requis :**
```typescript
to: [session.customer_details?.email as string],
```

### 5.3 Fonctionnalités Manquantes

#### ❌ Modèle Order [P0]

```prisma
model Order {
  id                 String   @id @default(cuid())
  buyerId            String
  templateId         String
  paymentIntentId    String   @unique
  stripeSessionId    String?
  amount             Int      // Prix payé en cents
  platformFee        Int      // Commission plateforme
  downloadAvailable  Boolean  @default(false)
  downloadCount      Int      @default(0)
  createdAt          DateTime @default(now())
  
  buyer    User     @relation("Purchases", fields: [buyerId], references: [id])
  template Template @relation(fields: [templateId], references: [id])
  
  @@index([buyerId])
  @@index([templateId])
}
```

#### ❌ Page /download/[orderId] [P0]

| Élément | État | Description |
|---------|------|-------------|
| Vérification `order.buyerId = currentUser.id` | ❌ | Sécurité |
| Vérification `order.downloadAvailable = true` | ❌ | |
| Liste des fichiers téléchargeables | ❌ | Avec icônes par type |
| Boutons de téléchargement individuels | ❌ | |
| Bouton "Download All" (ZIP) | ❌ | |
| Compteur de téléchargements | ❌ | |
| Expiration des liens | ❌ | (optionnel V1) |

#### ❌ Historique des achats /user/purchases [P1]

| Élément | État |
|---------|------|
| Liste des templates achetés | ❌ |
| Date d'achat | ❌ |
| Prix payé | ❌ |
| Lien vers téléchargement | ❌ |
| Lien vers template | ❌ |

#### ❌ Templates gratuits [P0]

| Élément | État | Description |
|---------|------|-------------|
| Toggle Free/Paid dans formulaire | ❌ | Si OFF, prix = 0 |
| Bypass Stripe pour templates gratuits | ❌ | Créer Order directement |
| Bouton "Download Free" | ❌ | Au lieu de "Buy for $0" |
| Email de confirmation | ❌ | Même flow que payant |

---

## ❤️ 6. Favoris Utilisateur

### 6.1 État Actuel

```
❌ Aucune fonctionnalité de favoris
```

### 6.2 Fonctionnalités Manquantes

#### ❌ Modèle Favorite [P1]

```prisma
model Favorite {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  createdAt   DateTime @default(now())
  
  template Template @relation(fields: [templateId], references: [id])
  user     User     @relation(fields: [userId], references: [id])
  
  @@unique([templateId, userId])
  @@index([userId])
}
```

#### ❌ API Favorites [P1]

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/favorites` | GET | Liste des favoris de l'utilisateur |
| `/api/favorites` | POST | Ajouter un favori |
| `/api/favorites/[templateId]` | DELETE | Retirer un favori |
| `/api/favorites/[templateId]` | GET | Vérifier si favori |

#### ❌ Page /user/favorites [P1]

| Élément | État |
|---------|------|
| Liste des templates likés | ❌ |
| Cartes cliquables vers /templates/[slug] | ❌ |
| Bouton unlike sur chaque carte | ❌ |
| État vide | ❌ |
| Tri par date d'ajout | ❌ |

#### ❌ Composant LikeButton [P1]

| Élément | État |
|---------|------|
| Toggle like/unlike | ❌ |
| Optimistic update | ❌ |
| Animation cœur | ❌ |
| Compteur mis à jour | ❌ |

---

## 👨‍🎨 7. Espace Créateur

### 7.1 État Actuel

```
✅ Page /sell avec formulaire basique
✅ Page /my-products (liste simple de ProductCard)
✅ Page /billing (Stripe Connect onboarding + dashboard link)
✅ Page /settings (firstName, lastName)
⚠️ Email hardcodé dans SettingsForm ("jan@alenix.de")
❌ Pas de dashboard avec stats
❌ Pas de gestion de statut (draft/pending/published)
❌ Pas d'édition de produits
❌ Pas de suppression de produits
❌ Pas de page créateur publique
❌ Pas de username/bio
```

### 7.2 Bugs/Issues Identifiés

#### 🐛 Emails hardcodés

```typescript
// app/components/form/SettingsForm.tsx ligne 63
defaultValue={"jan@alenix.de"} // ❌ Devrait être {email}

// app/components/UserNav.tsx ligne 39
jan@alenix.de // ❌ Devrait être {email}
```

### 7.3 Fonctionnalités Manquantes

#### ❌ Dashboard /creator/dashboard [P0]

| Élément | État | Description |
|---------|------|-------------|
| **Stats Cards** | | |
| Total ventes (nombre) | ❌ | `COUNT(orders)` |
| Revenus bruts | ❌ | `SUM(order.amount)` |
| Revenus nets (après commission) | ❌ | `SUM(order.amount - order.platformFee)` |
| Rating moyen | ❌ | `AVG(reviews.rating)` |
| Total favoris | ❌ | `SUM(templates.likeCount)` |
| **Graphiques** | | |
| Ventes sur 30 jours | ❌ | Line chart |
| Revenus par template | ❌ | Bar chart |
| **Tableau templates** | | |
| Titre | ❌ | |
| Statut (badge coloré) | ❌ | DRAFT/PENDING/PUBLISHED/REJECTED |
| Vues | ❌ | |
| Ventes | ❌ | |
| Revenus | ❌ | |
| Rating | ❌ | |
| Likes | ❌ | |
| Actions: éditer, voir, supprimer | ❌ | |
| **Filtres tableau** | | |
| Par statut | ❌ | |
| Recherche par titre | ❌ | |

#### ❌ Liste templates /creator/templates [P0]

| Élément | État |
|---------|------|
| Vue liste/tableau complète | ❌ |
| Tri par statut/date/ventes | ❌ |
| Filtres par statut | ❌ |
| Bulk actions | ❌ (optionnel) |
| Pagination | ❌ |

#### ❌ Formulaire création /creator/templates/new [P0]

Refonte complète du formulaire `/sell`.

##### Section Visuels [P0]

| Élément | État | Validation |
|---------|------|------------|
| Titre "Visuals" | ❌ | |
| Sous-texte | ❌ | "Add at least two images that showcase your template." |
| Dropzone images | ⚠️ Partiel | 2-4 images (actuel: 0-5) |
| Preview des images uploadées | ❌ | |
| Réorganisation drag & drop | ❌ | |
| Suppression d'image | ❌ | |

##### Section Infos de base [P0]

| Élément | État | Validation |
|---------|------|------------|
| Name | ✅ | ~50 caractères |
| Byline | ❌ | ~80 caractères, optionnel |
| Short Description | ✅ | max 260 caractères |

##### Section Classification [P0]

| Élément | État | Limites |
|---------|------|---------|
| Categories (multi-select) | ❌ | 0/3 |
| Styles (multi-select) | ❌ | 0/5 |
| Subcategories (multi-select, filtré) | ❌ | 0/6 |
| Tags (chips input) | ❌ | Suggestions + saisie libre |

##### Section Tech & IA [P0]

| Élément | État | Type |
|---------|------|------|
| Tech Stack | ❌ | Radio: HTML / React Vite / Next.js |
| Compatible AI Platforms | ❌ | Multi-select: 10+ plateformes |

##### Section Fichiers [P0]

**Comportement conditionnel selon TechStack :**

| TechStack | Upload | Validation | État |
|-----------|--------|------------|------|
| **HTML** | Multi-fichiers (.html, .css, .js, images) | ❌ | ❌ |
| | Bouton "Set as preview" sur chaque .html | ❌ | ❌ |
| | Au moins 1 fichier HTML requis | ❌ | ❌ |
| | previewFile obligatoire | ❌ | ❌ |
| **React Vite** | 1 fichier .zip | ❌ | ❌ |
| | Champ Live demo URL | ❌ | ❌ |
| | URL valide obligatoire | ❌ | ❌ |
| **Next.js** | 1 fichier .zip | ❌ | ❌ |
| | Champ Live demo URL | ❌ | ❌ |
| | URL valide obligatoire | ❌ | ❌ |

##### Section Pricing [P0]

| Élément | État | Description |
|---------|------|-------------|
| Toggle Paid | ❌ | OFF = gratuit (prix = 0) |
| Champ Price (si Paid = ON) | ⚠️ Partiel | Numeric input en euros/cents |
| Affichage prix final | ❌ | Avec commission plateforme |

##### Section Full Description [P1]

| Élément | État |
|---------|------|
| Titre "Full Description" | ❌ |
| TipTap editor enrichi | ✅ |
| Support liens | ❌ (manque dans TipTap) |
| Support listes | ❌ (manque dans TipTap) |

##### Actions [P0]

| Élément | État | Description |
|---------|------|-------------|
| Save as Draft | ❌ | Statut → DRAFT |
| Publish (Submit for Review) | ❌ | Statut → PENDING |
| Preview | ❌ | Voir le template comme un acheteur |

#### ❌ Édition /creator/templates/[id]/edit [P0]

| Élément | État |
|---------|------|
| Même structure que new | ❌ |
| Chargement données existantes | ❌ |
| Pre-fill de tous les champs | ❌ |
| Gestion transition PUBLISHED → PENDING | ❌ |
| Message de confirmation | ❌ |

#### ❌ Suppression de template [P1]

| Élément | État |
|---------|------|
| Bouton supprimer | ❌ |
| Confirmation modale | ❌ |
| Soft delete vs hard delete | ❌ |
| Restriction si ventes existantes | ❌ |

#### ❌ Profil créateur /creator/profile [P1]

| Élément | État |
|---------|------|
| Username unique | ❌ |
| Validation username (alphanum, tirets) | ❌ |
| Bio courte | ❌ |
| Avatar upload | ❌ |
| Lien Stripe Connect | ⚠️ Dans /billing |
| Preview de la page publique | ❌ |

#### ❌ Page publique /creator/[username] [P1]

| Élément | État |
|---------|------|
| Avatar, nom, bio | ❌ |
| Styles dominants (calculés) | ❌ |
| Catégories dominantes (calculées) | ❌ |
| Rating moyen global | ❌ |
| Total likes sur tous templates | ❌ |
| Nombre de templates publiés | ❌ |
| Liste templates publiés | ❌ |
| Filtres (style, catégorie, stack, platform) | ❌ |
| Grille de templates | ❌ |
| Lien de partage | ❌ |

---

## 🛡️ 8. Espace Admin

### 8.1 État Actuel

```
❌ Aucune fonctionnalité admin
❌ Pas de middleware de protection admin
❌ Pas de rôle UserRole.ADMIN
```

### 8.2 Fonctionnalités Manquantes

#### ❌ Middleware Admin [P0]

```typescript
// middleware.ts ou dans chaque route admin
if (user.role !== 'ADMIN') {
  redirect('/');
}
```

#### ❌ Dashboard /admin [P0]

| Élément | État |
|---------|------|
| **Stats globales** | |
| Nb templates par statut | ❌ |
| Nb total de ventes | ❌ |
| Revenus plateforme (commissions) | ❌ |
| Nb utilisateurs | ❌ |
| Nb créateurs | ❌ |
| **Alertes** | |
| Templates en attente de modération | ❌ |
| Reviews signalées | ❌ |
| **Top templates** | |
| Par ventes | ❌ |
| Par rating | ❌ |
| Par likes | ❌ |

#### ❌ Gestion templates /admin/templates [P0]

| Élément | État |
|---------|------|
| Liste complète avec filtres | ❌ |
| Filtre par statut | ❌ |
| Filtre par créateur | ❌ |
| Recherche par titre/slug | ❌ |
| Tri multi-colonnes | ❌ |
| Pagination | ❌ |

#### ❌ Vue détaillée /admin/templates/[id] [P0]

| Élément | État |
|---------|------|
| Toutes les métadonnées | ❌ |
| Preview du template | ❌ |
| Historique des modifications | ❌ |
| Infos créateur | ❌ |
| Stats (vues, ventes, rating) | ❌ |
| **Actions** | |
| Approve → PUBLISHED | ❌ |
| Reject → REJECTED + message | ❌ |
| Edit (override créateur) | ❌ |
| Delete | ❌ |
| Feature/Unfeature | ❌ |

#### ❌ Gestion reviews /admin/reviews [P1]

| Élément | État |
|---------|------|
| Liste de toutes les reviews | ❌ |
| Tri/filtre par template | ❌ |
| Tri/filtre par score | ❌ |
| Tri/filtre par date | ❌ |
| Filtre reviews signalées | ❌ |
| Action: supprimer review | ❌ |
| Action: masquer review | ❌ |

#### ❌ Gestion utilisateurs /admin/users [P2]

| Élément | État |
|---------|------|
| Liste des utilisateurs | ❌ |
| Filtre par rôle | ❌ |
| Changer rôle (USER → CREATOR → ADMIN) | ❌ |
| Suspendre utilisateur | ❌ |
| Voir activité | ❌ |

---

## 🤖 9. IA & Recommandation

### 9.1 État Actuel

```
❌ Aucune fonctionnalité IA
❌ Pas d'embeddings
❌ Pas de vector store
❌ Pas de recherche sémantique
```

### 9.2 Fonctionnalités Manquantes

#### ❌ Endpoint POST /api/ai/suggest-templates [P0]

**Input :**
```json
{
  "query": "Landing Next.js pour un SaaS B2B, style dark minimal"
}
```

**Output :**
```json
{
  "templates": [
    {
      "id": "tmpl_123",
      "title": "Dark SaaS Next.js Starter",
      "slug": "dark-saas-nextjs-starter",
      "mainStyle": "dark-saas",
      "categories": ["Marketing & Landing"],
      "subcategories": ["SaaS", "Pricing"],
      "techStack": "NEXTJS",
      "platforms": ["V0"],
      "price": 4900,
      "ratingAverage": 4.8,
      "likeCount": 37,
      "previewImage": "https://...",
      "score": 0.93,
      "explanation": "Matches your request for a dark SaaS Next.js landing compatible with v0.dev."
    }
  ],
  "meta": {
    "totalMatches": 15,
    "queryTokens": ["landing", "nextjs", "saas", "b2b", "dark", "minimal"],
    "processingTime": 234
  }
}
```

#### ❌ Logique IA [P0]

| Étape | Description | État |
|-------|-------------|------|
| 1. Tokenization | Extraire mots-clés de la query | ❌ |
| 2. Embeddings | Générer vecteur de la query | ❌ |
| 3. Similarity Search | Chercher templates similaires | ❌ |
| 4. Filtering | Appliquer filtres (status=PUBLISHED) | ❌ |
| 5. Reranking | Pondérer par rating, likes, ventes | ❌ |
| 6. Explanation | Générer explication du match | ❌ |
| 7. Limit | Retourner max 6 templates | ❌ |

#### ❌ Génération des embeddings templates [P0]

| Champ | Poids | État |
|-------|-------|------|
| title | Élevé | ❌ |
| shortDesc | Élevé | ❌ |
| longDesc | Moyen | ❌ |
| styles | Élevé | ❌ |
| categories | Élevé | ❌ |
| subcategories | Moyen | ❌ |
| tags | Moyen | ❌ |
| techStack | Élevé | ❌ |
| platforms | Moyen | ❌ |

**Texte à embedder (exemple) :**
```
Title: Dark SaaS Next.js Starter
Description: Modern landing page template for SaaS products...
Styles: dark-saas, clean-minimal
Categories: Marketing & Landing
Subcategories: SaaS, Pricing
Tags: saas, b2b, landing, dark-mode
Tech: Next.js
Platforms: v0.dev, Lovable
```

#### ❌ Infrastructure requise [P0]

| Composant | Options | Recommandation |
|-----------|---------|----------------|
| Embeddings API | OpenAI, Cohere, Voyage AI | OpenAI `text-embedding-3-small` |
| Vector Store | Pinecone, Supabase pgvector, Qdrant | Supabase pgvector (déjà utilisé) |
| Cache | Redis, Upstash | Optionnel V1 |

#### ❌ Indexation automatique [P1]

| Trigger | Action | État |
|---------|--------|------|
| Template créé/publié | Générer embedding, stocker | ❌ |
| Template modifié | Re-générer embedding | ❌ |
| Template supprimé | Supprimer embedding | ❌ |

---

## 🎨 10. Système de Classification

### 10.1 État Actuel

```
✅ 3 catégories simples (template, uikit, icon)
❌ Catégories ne correspondent pas au PRD
❌ Pas de styles
❌ Pas de sous-catégories
❌ Pas de tags
❌ Pas de plateformes IA
❌ Pas de tech stack (enum)
```

### 10.2 Migration des catégories

| Actuel | Action | PRD |
|--------|--------|-----|
| `template` | Supprimer | → Marketing & Landing |
| `uikit` | Supprimer | → Product & App UI |
| `icon` | Supprimer | → Dashboard & Analytics |

### 10.3 Styles à implémenter [P0]

**14 styles définis dans le PRD :**

| Style | Description |
|-------|-------------|
| `clean-minimal` | Épuré, minimaliste |
| `dark-saas` | Dark mode, SaaS |
| `pastel-playful` | Couleurs pastel, ludique |
| `cyberpunk` | Futuriste, néon |
| `neo-brutalism` | Brutaliste moderne |
| `editorial-magazine` | Style magazine |
| `rounded-soft` | Coins arrondis, doux |
| `warm-organic` | Couleurs chaudes, naturel |
| `gradient-fusion` | Dégradés |
| `retro-90s` | Rétro années 90 |
| `futuristic-ui` | Interface futuriste |
| `dashboard-modern` | Dashboard moderne |
| `mobile-first` | Optimisé mobile |
| `geometric-tech` | Formes géométriques |

*Règle: jusqu'à 5 styles par template*

### 10.4 Catégories à implémenter [P0]

| Catégorie | Icône suggérée | Description |
|-----------|----------------|-------------|
| Marketing & Landing | 🚀 | Landing pages, sites marketing |
| Product & App UI | 📱 | Interfaces d'applications |
| Dashboard & Analytics | 📊 | Tableaux de bord, analytics |

*Règle: jusqu'à 3 catégories par template*

### 10.5 Sous-catégories à implémenter [P0]

| Catégorie | Sous-catégories |
|-----------|-----------------|
| **Marketing & Landing** | SaaS, Agency, Personal brand, Product launch, Waitlist, Pricing |
| **Product & App UI** | Auth, Onboarding, Settings, Profile, Feed, Messaging |
| **Dashboard & Analytics** | Admin, Finance, CRM, Analytics, KPI Overview, Ops |

*Règle: jusqu'à 6 sous-catégories par template (toutes catégories confondues)*

### 10.6 Plateformes IA à implémenter [P0]

| Plateforme | Logo/Icône | URL |
|------------|------------|-----|
| v0.dev | ❌ | v0.dev |
| Lovable | ❌ | lovable.dev |
| Subframe | ❌ | subframe.com |
| Magic Patterns | ❌ | magicpatterns.com |
| Uizard | ❌ | uizard.io |
| Onlook | ❌ | onlook.dev |
| Replit Design Mode | ❌ | replit.com |
| Aura.build | ❌ | aura.build |
| MagicPath | ❌ | - |
| Stitch | ❌ | - |

### 10.7 Tech Stack à implémenter [P0]

| Stack | Icône | Extensions fichiers |
|-------|-------|---------------------|
| HTML | 🌐 | .html, .css, .js |
| React (Vite) | ⚛️ | .zip (projet Vite) |
| Next.js | ▲ | .zip (projet Next.js) |

---

## 📁 11. Routes Manquantes

### 11.1 Refactoring des routes

| Route Actuelle | Action | Route PRD |
|----------------|--------|-----------|
| `/` | Refonte | `/` (Hero IA + blocs) |
| `/products/[category]` | Supprimer | → `/templates` |
| `/product/[id]` | Supprimer | → `/templates/[slug]` |
| `/sell` | Déplacer | → `/creator/templates/new` |
| `/my-products` | Déplacer | → `/creator/templates` |
| `/billing` | Conserver ou déplacer | → `/creator/billing` |
| `/settings` | Déplacer | → `/creator/profile` ou `/user/settings` |
| `/payment/success` | Renommer | → `/purchase/success` |
| `/payment/cancel` | Renommer | → `/purchase/cancel` |
| `/return/[id]` | Conserver | `/return/[accountId]` |

### 11.2 Nouvelles routes à créer

| Route | Priorité | Description |
|-------|----------|-------------|
| `/templates` | P0 | Explorer avec filtres |
| `/templates/[slug]` | P0 | Détail template |
| `/creator/[username]` | P1 | Page créateur publique |
| `/creator/dashboard` | P0 | Dashboard créateur |
| `/creator/templates` | P0 | Liste templates créateur |
| `/creator/templates/new` | P0 | Nouveau template |
| `/creator/templates/[id]/edit` | P0 | Édition template |
| `/creator/profile` | P1 | Profil créateur |
| `/user/favorites` | P1 | Favoris utilisateur |
| `/user/purchases` | P1 | Historique achats |
| `/download/[orderId]` | P0 | Téléchargement sécurisé |
| `/admin` | P0 | Dashboard admin |
| `/admin/templates` | P0 | Gestion templates |
| `/admin/templates/[id]` | P0 | Détail template admin |
| `/admin/reviews` | P1 | Gestion reviews |
| `/admin/reviews/[id]` | P1 | Détail review admin |
| `/admin/users` | P2 | Gestion utilisateurs |

### 11.3 API Routes Manquantes

| Route | Méthode | Priorité | Description |
|-------|---------|----------|-------------|
| `/api/ai/suggest-templates` | POST | P0 | Recherche IA |
| `/api/templates` | GET | P0 | Liste avec filtres |
| `/api/templates/[slug]` | GET | P0 | Détail template |
| `/api/templates` | POST | P0 | Créer template |
| `/api/templates/[id]` | PUT | P0 | Modifier template |
| `/api/templates/[id]` | DELETE | P1 | Supprimer template |
| `/api/favorites` | GET | P1 | Liste favoris user |
| `/api/favorites` | POST | P1 | Ajouter favori |
| `/api/favorites/[templateId]` | DELETE | P1 | Retirer favori |
| `/api/reviews` | GET | P1 | Liste reviews |
| `/api/reviews` | POST | P1 | Ajouter review |
| `/api/reviews/[id]` | PUT | P1 | Modifier review |
| `/api/reviews/[id]` | DELETE | P1 | Supprimer review |
| `/api/admin/templates/[id]/approve` | POST | P0 | Approuver template |
| `/api/admin/templates/[id]/reject` | POST | P0 | Rejeter template |
| `/api/creator/stats` | GET | P1 | Stats créateur |
| `/api/admin/stats` | GET | P0 | Stats admin |

---

## 🧩 12. Composants UI Manquants

### 12.1 Composants à créer

| Composant | Priorité | Description |
|-----------|----------|-------------|
| `AISearchBox` | P0 | Textarea + bouton recherche IA |
| `AIResultsGrid` | P0 | Grille résultats IA avec scores |
| `StyleChips` | P0 | Liste de chips styles cliquables |
| `StyleChip` | P0 | Chip individuel avec icône |
| `CategoryCards` | P0 | 3 grandes cartes catégories |
| `CategoryCard` | P0 | Carte catégorie individuelle |
| `PlatformIcons` | P0 | Bande d'icônes plateformes IA |
| `PlatformIcon` | P0 | Icône plateforme individuelle |
| `TemplateCard` | P0 | Refonte ProductCard enrichie |
| `FilterSidebar` | P0 | Panneau de filtres |
| `FilterChips` | P0 | Filtres actifs en chips |
| `SortDropdown` | P0 | Dropdown de tri |
| `TechStackBadge` | P0 | Badge HTML/Vite/Next.js |
| `StatusBadge` | P0 | Badge DRAFT/PENDING/PUBLISHED/REJECTED |
| `RatingStars` | P1 | Affichage ★ 1-5 |
| `RatingInput` | P1 | Sélecteur de rating (1-5 étoiles) |
| `LikeButton` | P1 | Toggle like avec compteur |
| `ReviewCard` | P1 | Affichage d'une review |
| `ReviewForm` | P1 | Formulaire review |
| `ReviewSummary` | P1 | Résumé ratings avec distribution |
| `FileUploadConditional` | P0 | Upload fichiers selon TechStack |
| `FilePreview` | P0 | Preview fichier uploadé |
| `PreviewIframe` | P0 | Preview conditionnelle HTML/Vite/Next.js |
| `CreatorStats` | P1 | Cartes stats créateur |
| `AdminStats` | P0 | Cartes stats admin |
| `DataTable` | P0 | Tableau de données générique |
| `Pagination` | P0 | Composant pagination |
| `EmptyState` | P1 | État vide générique |
| `ConfirmDialog` | P1 | Dialogue de confirmation |
| `TagInput` | P0 | Input avec chips pour tags |
| `MultiSelect` | P0 | Sélection multiple avec dropdown |
| `RangeSlider` | P1 | Slider pour range de prix |
| `Breadcrumbs` | P1 | Fil d'Ariane |
| `Footer` | P1 | Footer global |

### 12.2 Composants UI Shadcn manquants

| Composant | Priorité |
|-----------|----------|
| `@radix-ui/react-checkbox` | P0 |
| `@radix-ui/react-radio-group` | P0 |
| `@radix-ui/react-select` | P0 |
| `@radix-ui/react-slider` | P1 |
| `@radix-ui/react-tabs` | P0 |
| `@radix-ui/react-tooltip` | P1 |
| `@radix-ui/react-progress` | P1 |
| `@radix-ui/react-alert-dialog` | P1 |
| `@radix-ui/react-toggle` | P0 |
| `@radix-ui/react-toggle-group` | P0 |

---

## 🔒 13. Sécurité & Performance

### 13.1 État Actuel

```
✅ Authentification Kinde
✅ Validation Zod côté serveur
✅ Webhook signature verification Stripe
✅ Protection routes par getKindeServerSession()
⚠️ Pas de middleware global
⚠️ Pas de rate limiting
⚠️ Pas de CORS configuré
⚠️ Pas de CSP headers
❌ Pas de rôles/permissions
❌ Pas d'audit log
```

### 13.2 Issues de Sécurité Identifiées

| Issue | Sévérité | Description |
|-------|----------|-------------|
| Email hardcodé webhook | 🔴 Haute | Email envoyé à adresse fixe |
| Pas de vérification propriétaire | 🟡 Moyenne | N'importe qui peut voir /my-products d'un autre |
| UUID exposé dans URLs | 🟡 Moyenne | Préférer slugs |
| Pas de limite d'upload | 🟡 Moyenne | Abus possible |
| Pas de validation MIME types | 🟡 Moyenne | Upload de fichiers malveillants |

### 13.3 Fonctionnalités de Sécurité Manquantes

| Fonctionnalité | Priorité |
|----------------|----------|
| Middleware de rôles (USER/CREATOR/ADMIN) | P0 |
| Rate limiting API | P1 |
| CORS configuration | P1 |
| CSP headers | P1 |
| Audit log des actions sensibles | P2 |
| Vérification ownership des ressources | P0 |
| Sanitization des inputs (XSS) | P0 |
| Validation des URLs (liveDemoUrl) | P0 |

### 13.4 Performance Manquantes

| Fonctionnalité | Priorité |
|----------------|----------|
| Indexes Prisma optimisés | P0 |
| Mise en cache (Redis/Upstash) | P1 |
| Image optimization (next/image déjà) | ✅ |
| Lazy loading composants | P1 |
| Pagination côté serveur | P0 |
| Prefetching links | P1 |
| Bundle analysis | P2 |

---

## 🌐 14. SEO, Branding & Internationalisation

### 14.1 État Actuel

```
⚠️ Metadata générique "Create Next App"
⚠️ Pas de metadata par page
⚠️ Pas de sitemap.xml
⚠️ Pas de robots.txt
❌ Pas d'Open Graph tags
❌ Pas de Twitter cards
❌ Pas de JSON-LD structured data
❌ Dark mode configuré mais non utilisé
❌ Branding incohérent (MarshalUI vs nouvelle marque)
```

### 14.2 Metadata Manquantes

#### Layout principal [P0]

```typescript
// app/layout.tsx - À remplacer
export const metadata: Metadata = {
  title: {
    default: "AI Template Marketplace - AI-Ready Design Templates",
    template: "%s | AI Template Marketplace"
  },
  description: "The premier marketplace for AI-ready design templates. Find HTML, React, and Next.js templates optimized for v0.dev, Lovable, and more.",
  keywords: ["AI templates", "v0.dev", "Lovable", "Next.js templates", "React templates"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "AI Template Marketplace",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle"
  }
};
```

#### Metadata dynamiques par page [P1]

| Page | Metadata dynamiques |
|------|---------------------|
| `/templates/[slug]` | Titre, description, images du template |
| `/creator/[username]` | Nom, bio, avatar du créateur |
| `/templates?category=X` | Catégorie dans le titre |

### 14.3 Fichiers SEO Manquants

| Fichier | Priorité | Description |
|---------|----------|-------------|
| `app/sitemap.ts` | P1 | Sitemap dynamique |
| `app/robots.ts` | P1 | Robots.txt |
| `public/og-image.png` | P1 | Image Open Graph par défaut |
| `public/favicon.ico` | ⚠️ | Existe mais générique |

### 14.4 Branding à Mettre à Jour

| Élément | Actuel | Cible |
|---------|--------|-------|
| Nom de l'app | MarshalUI | [Nouveau nom à définir] |
| Logo | `/public/logos/` | À créer/mettre à jour |
| Couleur primaire | Bleu (#... ) | À définir |
| Favicon | Générique Next.js | À créer |
| Email "from" | MarshalUI | Nouveau nom |

### 14.5 Dark Mode [P2]

```
✅ next-themes installé
✅ Variables CSS dark définies
❌ Toggle dark/light non implémenté
❌ Pas de ThemeProvider
```

### 14.6 Internationalisation [P2]

Le PRD mentionne du texte en français pour le placeholder IA. À considérer :

| Élément | État |
|---------|------|
| i18n setup (next-intl) | ❌ |
| Fichiers de traduction | ❌ |
| Switcher de langue | ❌ |

---

## 📱 15. UX & Accessibilité

### 15.1 État Actuel

```
✅ Composants Shadcn/Radix (accessibles)
✅ Responsive basique
⚠️ Pas de skeleton sur toutes les pages
⚠️ Pas d'états vides cohérents
❌ Pas de breadcrumbs
❌ Pas de footer
❌ Pas de pages d'erreur personnalisées
❌ Pas de feedback utilisateur cohérent
```

### 15.2 Fonctionnalités UX Manquantes

| Fonctionnalité | Priorité |
|----------------|----------|
| Footer global | P1 |
| Breadcrumbs | P1 |
| Page 404 personnalisée | P1 |
| Page 500 personnalisée | P1 |
| États vides cohérents | P1 |
| Loading states uniformes | P0 |
| Success/Error toasts cohérents | ⚠️ Partiel |
| Confirmation dialogs | P1 |
| Skeleton loading sur toutes les pages | P0 |
| Scroll to top | P2 |
| Infinite scroll ou pagination | P0 |
| Recherche globale | P1 |
| Raccourcis clavier | P2 |

### 15.3 Accessibilité Manquante

| Élément | Priorité |
|---------|----------|
| Skip to content link | P1 |
| ARIA labels sur actions | P1 |
| Focus visible | ⚠️ Partiel |
| Alt text sur images | ⚠️ Partiel |
| Color contrast | À vérifier |
| Keyboard navigation | ⚠️ Partiel |

---

## 📧 16. Emails & Notifications

### 16.1 État Actuel

```
✅ Resend configuré
✅ React Email pour templates
✅ Email achat avec lien téléchargement
⚠️ Email envoyé à adresse hardcodée
❌ Pas d'email de bienvenue
❌ Pas d'email de validation template
❌ Pas de notifications in-app
```

### 16.2 Emails Manquants

| Email | Trigger | Priorité |
|-------|---------|----------|
| Bienvenue | Inscription | P2 |
| Template soumis | Créateur soumet | P1 |
| Template approuvé | Admin approuve | P1 |
| Template rejeté | Admin rejette (avec raison) | P1 |
| Nouvelle vente | Vente créateur | P1 |
| Nouvelle review | Review sur template | P2 |

### 16.3 Templates Email à Créer

| Template | Priorité |
|----------|----------|
| `WelcomeEmail.tsx` | P2 |
| `TemplateSubmittedEmail.tsx` | P1 |
| `TemplateApprovedEmail.tsx` | P1 |
| `TemplateRejectedEmail.tsx` | P1 |
| `NewSaleEmail.tsx` | P1 |
| `NewReviewEmail.tsx` | P2 |

---

## 📜 17. Pages Légales & Informatives

### 17.1 État Actuel

```
❌ Pas de CGV/CGU
❌ Pas de politique de confidentialité
❌ Pas de page "À propos"
❌ Pas de FAQ
❌ Pas de page Contact
```

### 17.2 Pages à Créer

| Page | Route | Priorité |
|------|-------|----------|
| CGU/Terms of Service | `/legal/terms` | P1 (avant lancement) |
| Politique de confidentialité | `/legal/privacy` | P1 (avant lancement) |
| À propos | `/about` | P2 |
| FAQ | `/faq` | P2 |
| Contact | `/contact` | P2 |
| Devenir créateur | `/become-creator` | P2 |

---

## 📊 18. Récapitulatif par Priorité

### P0 — Critique (MVP - Semaines 1-4)

1. ✏️ **Migration schéma Prisma**
   - Nouveaux modèles (Template, Order, etc.)
   - Nouveaux enums
   - Nouvelles relations

2. 🏠 **Refonte page d'accueil**
   - AI Template Finder
   - Styles populaires
   - Nouvelles catégories
   - Plateformes IA

3. 🔎 **Page Explorer /templates**
   - Système de filtres complet
   - Tri multi-critères
   - Pagination
   - URL avec query params

4. 📄 **Refonte page template**
   - Slug au lieu de UUID
   - Header enrichi
   - Preview conditionnelle
   - Toutes les métadonnées

5. 👨‍🎨 **Espace créateur**
   - Dashboard avec stats
   - Formulaire création enrichi
   - Gestion des statuts
   - Édition de templates

6. 🛡️ **Espace admin**
   - Dashboard
   - Modération templates
   - Workflow approve/reject

7. 🤖 **Système IA**
   - Endpoint suggest-templates
   - Embeddings
   - Vector search

8. 💾 **Paiement & Download**
   - Modèle Order
   - Page download sécurisée
   - Fix email webhook

9. 🔐 **Sécurité**
   - Middleware rôles
   - Fix emails hardcodés
   - Validation ownership

### P1 — Important (Semaines 5-6)

1. ❤️ **Système favoris**
2. ⭐ **Système reviews**
3. 👤 **Pages créateurs publiques**
4. 📊 **Stats créateur détaillées**
5. 📧 **Emails transactionnels**
6. 🎨 **Branding & SEO**
7. 📜 **Pages légales**
8. 🧩 **Composants UI manquants**

### P2 — Nice to have (Post-MVP)

1. 🧑‍🎨 Créateurs mis en avant
2. 📈 Analytics avancées
3. 🔔 Notifications in-app
4. 🌐 Internationalisation
5. 🌙 Dark mode toggle
6. 🔍 Recherche globale
7. ⌨️ Raccourcis clavier
8. 📱 PWA

---

## 🛠️ 19. Dépendances à Ajouter

### NPM Packages

```json
{
  "dependencies": {
    "openai": "^4.x",
    "@supabase/supabase-js": "^2.x",
    "slugify": "^1.x",
    "date-fns": "^3.x",
    "@tanstack/react-table": "^8.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "@types/slug": "^x.x"
  }
}
```

### Composants Shadcn à installer

```bash
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add select
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add pagination
```

### Variables d'Environnement Additionnelles

```bash
# IA
OPENAI_API_KEY=sk-xxx

# Optionnel: Pinecone si pas pgvector
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=xxx
PINECONE_INDEX=xxx

# Analytics (optionnel)
NEXT_PUBLIC_ANALYTICS_ID=xxx
```

---

## 📋 20. Checklist de Migration

### Phase 1 : Préparation

- [ ] Sauvegarder la base de données actuelle
- [ ] Documenter les products existants
- [ ] Préparer les seeds pour styles, catégories, sous-catégories
- [ ] Définir le mapping Product → Template

### Phase 2 : Migration Schéma

- [ ] Créer les nouveaux modèles Prisma
- [ ] Créer les enums
- [ ] Ajouter les relations
- [ ] Générer la migration
- [ ] Tester sur environnement de dev

### Phase 3 : Migration Données

- [ ] Script de migration Product → Template
- [ ] Attribution de slugs uniques
- [ ] Mapping des catégories
- [ ] Vérification de l'intégrité

### Phase 4 : Refactoring Code

- [ ] Renommer les routes
- [ ] Mettre à jour les imports
- [ ] Adapter les requêtes Prisma
- [ ] Mettre à jour les composants

### Phase 5 : Nouvelles Fonctionnalités

- [ ] Système de classification
- [ ] Filtres et tri
- [ ] IA
- [ ] Admin
- [ ] Reviews & Favoris

### Phase 6 : Tests & Déploiement

- [ ] Tests manuels complets
- [ ] Tests de régression
- [ ] Migration en production
- [ ] Monitoring post-déploiement

---

*Document généré le 3 décembre 2024*
*Basé sur l'analyse approfondie du code actuel vs PRD V1 Marketplace*
*Version 2.0 - Analyse complète*
