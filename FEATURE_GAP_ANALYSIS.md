# Feature Gap Analysis - V1 Marketplace
## Comparaison entre l'application actuelle et le PRD cible

*Date : 3 décembre 2025*

---

## 🎯 Vue d'ensemble

### Application actuelle : VibeBase/MarshalUI
Marketplace générique pour assets digitaux (templates Tailwind, UI kits, icons) avec fonctionnalités basiques de vente et achat.

### Application cible (PRD)
Marketplace spécialisée pour templates design AI-ready (HTML/React/Next.js) avec système de classification avancé, recommandations IA, et écosystème complet créateurs/acheteurs.

---

## 📊 Résumé des écarts majeurs

| Domaine | Statut actuel | Statut cible | Écart |
|---------|---------------|--------------|-------|
| **Classification des produits** | 3 catégories simples | 5 systèmes (styles, catégories, sous-catégories, tags, plateformes) | 🔴 Critique |
| **Recherche & Découverte** | Aucune recherche | IA + filtres avancés | 🔴 Critique |
| **Systèmes de feedback** | Aucun | Reviews, ratings, favorites, likes | 🔴 Critique |
| **Tech Stack** | Non différencié | HTML, React Vite, Next.js distincts | 🔴 Critique |
| **Previews** | Images statiques | Iframe sandbox + live demos | 🔴 Critique |
| **Admin/Modération** | Aucun | Système complet de modération | 🔴 Critique |
| **Profils créateurs** | Basique | Page publique + stats | 🟡 Important |
| **Téléchargements** | Email direct | Gestion d'orders + page sécurisée | 🟡 Important |

---

## 🗄️ 1. MODÈLE DE DONNÉES (Database Schema)

### ❌ Modèles manquants dans le schema actuel

#### 1.1 Enums

**Actuellement :**
```prisma
enum CategoryTypes {
  template
  uikit
  icon
}
```

**Requis (manquant) :**
```prisma
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

#### 1.2 Template Model - Champs manquants

**Template actuel (Product) :**
- ✅ id, name, price, description, images, createdAt
- ❌ **slug** (pour SEO & URLs propres)
- ❌ **shortDesc** vs smallDescription
- ❌ **longDesc** (description riche séparée)
- ❌ **status** (DRAFT/PENDING/PUBLISHED/REJECTED)
- ❌ **techStack** (HTML/REACT_VITE/NEXTJS)
- ❌ **previewFileId** (pour HTML preview)
- ❌ **liveDemoUrl** (pour Vite/Next.js demos)
- ❌ **ratingAverage** (note moyenne)
- ❌ **ratingCount** (nombre de ratings)
- ❌ **likeCount** (nombre de likes)
- ❌ **byline** (sous-titre optionnel)

#### 1.3 Modèles totalement absents

🔴 **TemplateFile** (gestion fichiers multiples)
```prisma
model TemplateFile {
  id          String   @id @default(cuid())
  templateId  String
  fileUrl     String
  fileType    FileType
  fileName    String
}
```

🔴 **StyleTag** (système de styles)
```prisma
model StyleTag {
  id    String @id @default(cuid())
  name  String @unique
}

model TemplateStyleTag {
  templateId String
  styleTagId String
  @@id([templateId, styleTagId])
}
```

🔴 **Category & Subcategory** (hiérarchie avancée)
```prisma
model Category {
  id             String @id @default(cuid())
  name           String @unique
  subcategories  Subcategory[]
}

model Subcategory {
  id          String @id @default(cuid())
  name        String
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  @@unique([categoryId, name])
}

model TemplateCategory {
  templateId String
  categoryId String
  @@id([templateId, categoryId])
}

model TemplateSubcategory {
  templateId    String
  subcategoryId String
  @@id([templateId, subcategoryId])
}
```

🔴 **Tag** (tags libres)
```prisma
model Tag {
  id    String @id @default(cuid())
  name  String @unique
}

model TemplateTag {
  templateId String
  tagId      String
  @@id([templateId, tagId])
}
```

🔴 **TemplatePlatform** (plateformes IA compatibles)
```prisma
model TemplatePlatform {
  id         String @id @default(cuid())
  templateId String
  platform   PlatformType
}
```

🔴 **Order** (système de commandes)
```prisma
model Order {
  id                 String   @id @default(cuid())
  buyerId            String
  templateId         String
  paymentIntentId    String
  downloadAvailable  Boolean  @default(false)
  createdAt          DateTime @default(now())
}
```

🔴 **Review** (avis clients)
```prisma
model Review {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  rating      Int
  comment     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@unique([templateId, userId])
}
```

🔴 **Favorite** (système de likes)
```prisma
model Favorite {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  createdAt   DateTime @default(now())
  @@unique([templateId, userId])
}
```

#### 1.4 User Model - Champs manquants

**Actuellement :**
```prisma
model User {
  id, email, firstName, lastName, profileImage
  connectedAccountId, stripeConnectedLinked
}
```

**Manquant :**
- ❌ **username** (pour page publique /creator/[username])
- ❌ **bio** (description créateur)
- ❌ **role** (USER/CREATOR/ADMIN)

---

## 🎨 2. SYSTÈME DE CLASSIFICATION

### 2.1 Styles (ex "vibes") - TOTALEMENT ABSENT

**Requis :** 
- Base de données StyleTag
- 14+ styles prédéfinis (clean-minimal, dark-saas, pastel-playful, etc.)
- Jusqu'à 5 styles par template
- Affichage en chips/badges
- Filtrage sur page explorer
- Section "Popular styles" sur homepage

**Statut actuel :** ❌ Aucun système de styles

**Travail requis :**
1. Créer models StyleTag + TemplateStyleTag
2. Seeder avec 14 styles initiaux
3. UI multi-select dans formulaire de création
4. Affichage des styles sur cartes templates
5. Filtres dans /templates
6. Section homepage

### 2.2 Catégories - STRUCTURE INADÉQUATE

**Actuellement :** 3 catégories simples (template, uikit, icon)

**Requis (PRD) :**
- Marketing & Landing
- Product & App UI
- Dashboard & Analytics
- Jusqu'à 3 catégories par template (multi-select)

**Écart :** 
- ❌ Mauvaise nomenclature
- ❌ Pas de multi-select (1 seule catégorie actuellement)
- ❌ Pas de table Category séparée

### 2.3 Sous-catégories - TOTALEMENT ABSENT

**Requis :**
- Hiérarchie Category → Subcategory
- Exemples :
  - Marketing & Landing : SaaS, Agency, Personal brand, Product launch, Waitlist, Pricing
  - Product & App UI : Auth, Onboarding, Settings, Profile, Feed, Messaging
  - Dashboard & Analytics : Admin, Finance, CRM, Analytics, KPI Overview, Ops
- Jusqu'à 6 sous-catégories par template
- UI : sélection filtrée par catégories parentes

**Statut actuel :** ❌ Aucune sous-catégorie

### 2.4 Tags - TOTALEMENT ABSENT

**Requis :**
- Système de tags libres/semi-contrôlés
- Input avec autocomplete/suggestions
- Utilisés pour recherche + IA
- Exemples : auth, saas-b2b, ecommerce, mobile-nav, dark-mode

**Statut actuel :** ❌ Aucun système de tags

### 2.5 Tech Stack - TOTALEMENT ABSENT

**Requis :**
- Distinction HTML / React Vite / Next.js
- Impact sur :
  - Type de preview (iframe vs live demo)
  - Types de fichiers acceptés
  - Instructions de téléchargement

**Statut actuel :** 
- ❌ Pas de champ techStack
- ❌ Tous templates traités de manière identique
- ❌ Upload ZIP générique sans distinction

### 2.6 Plateformes IA - TOTALEMENT ABSENT

**Requis :**
- Multi-select de plateformes compatibles
- Liste : v0.dev, Lovable, Subframe, Magic Patterns, Uizard, Onlook, Replit, Aura.build, MagicPath, Stitch
- Affichage en icônes sur cartes templates
- Filtrage par plateforme
- Section homepage avec bande d'icônes

**Statut actuel :** ❌ Aucune notion de plateforme IA

---

## 🤖 3. INTELLIGENCE ARTIFICIELLE & RECHERCHE

### 3.1 AI Template Finder - TOTALEMENT ABSENT

**Requis (PRD Section 5.1.1) :**
- Textarea full-width sur homepage
- Placeholder : "Décris ton besoin : 'Landing SaaS dark en Next.js'..."
- Endpoint : `POST /api/ai/suggest-templates`
- Logique :
  - Embeddings sur titre, descriptions, styles, catégories, tags
  - Similarité vectorielle avec query
  - Reranking par rating, likes, ventes
  - Retourne 3-6 templates recommandés
- États : loading (skeletons), error (fallback), no results (suggestions élargies)

**Statut actuel :** 
- ❌ Aucune fonctionnalité de recherche
- ❌ Aucune IA
- ❌ Pas d'endpoint /api/ai/*

**Complexité :** 🔴 Élevée
- Nécessite service d'embeddings (OpenAI, etc.)
- Base de données vectorielle ou approche hybrid
- Infrastructure de scoring/ranking

### 3.2 Recherche textuelle classique - ABSENTE

Même une recherche textuelle simple (pas IA) n'existe pas :
- ❌ Pas de barre de recherche
- ❌ Pas de filtre par nom/description

---

## 🔍 4. EXPLORATION & DÉCOUVERTE

### 4.1 Page d'accueil - PARTIELLE

**Actuellement présent :**
- ✅ Bloc "Newest Products" (via ProductRow)
- ✅ Blocs par catégorie (templates, icons, uikits)

**Manquant (PRD Section 5.1) :**
- ❌ **Bloc 1** : AI Template Finder (Hero)
- ❌ **Bloc 2** : Styles populaires (chips cliquables)
- ❌ **Bloc 3** : 3 grandes cartes catégories avec descriptions
- ❌ **Bloc 4** : Bande d'icônes plateformes IA
- ❌ **Bloc 5** : Templates populaires (algorithme ranking ventes+likes+rating)
- ❌ **Bloc 7** : Créateurs mis en avant

### 4.2 Page Explorer /templates - ABSENTE

**Requis (PRD Section 5.2) :**
- Page catalogue avec filtres avancés
- Bar de filtres horizontale :
  - Styles (multi-select)
  - Catégories (multi-select)
  - Sous-catégories (filtrées dynamiquement)
  - Tags
  - Tech Stack
  - Plateformes IA
  - Prix (free/paid/range)
- Tri :
  - Récent
  - Populaire
  - Prix croissant/décroissant
  - Meilleure note
  - Plus likés
- Grille de cartes
- Pagination ou infinite scroll

**Statut actuel :**
- ✅ `/products/[category]` existe mais limité
- ❌ Aucun filtre avancé
- ❌ Aucun tri
- ❌ Pas de page /templates globale

**Travail requis :**
1. Créer `/templates/page.tsx`
2. Composant FilterBar avec tous les filtres
3. Logique de query params + Prisma queries
4. UI de grille responsive
5. Pagination

---

## 📄 5. PAGE TEMPLATE DETAIL

### 5.1 Informations de base - PARTIELLES

**Actuellement présent :**
- ✅ Nom, prix, description
- ✅ Carousel d'images
- ✅ Lien créateur (User)
- ✅ Bouton Buy

**Manquant :**
- ❌ Slug-based URLs (actuellement /product/[id], requis /templates/[slug])
- ❌ Byline (sous-titre)
- ❌ Badges de styles (jusqu'à 5)
- ❌ Liste catégories & sous-catégories
- ❌ Tags affichés
- ❌ Tech stack badge
- ❌ Icônes plateformes IA
- ❌ Rating moyen + nb reviews
- ❌ Compteur de likes

### 5.2 Preview - INADÉQUATE

**Actuellement :** 
- Images statiques en carousel

**Requis :**
- **Si HTML :**
  - Iframe sandbox avec preview file HTML chargé
  - Isolation sécurité
- **Si React Vite / Next.js :**
  - Iframe sur liveDemoUrl
  - Bouton "Open live demo" (nouvel onglet)

**Statut :** ❌ Aucune preview interactive

**Complexité :** 🟡 Moyenne
- HTML preview : iframe sandbox + endpoint serving files
- Live demo : plus simple si URL externe fournie

### 5.3 Reviews & Ratings - TOTALEMENT ABSENT

**Requis (PRD Section 5.3.5) :**
- Sommaire : moyenne ★ (1-5), nb reviews
- Liste reviews :
  - Nom user, rating, texte, date
  - Pagination/lazy load
- Ajouter review :
  - Accessible uniquement si user a acheté template
  - 1 review par user/template
  - Édition possible
- Formulaire : rating (1-5) + commentaire optionnel

**Statut actuel :** ❌ Aucun système de review

**Travail requis :**
1. Model Review
2. Endpoint POST /api/reviews (ou Server Action)
3. Composant ReviewList + ReviewForm
4. Logique : vérifier Order avant autorisation
5. Calcul automatique ratingAverage & ratingCount sur Template

### 5.4 Likes / Favoris - TOTALEMENT ABSENT

**Requis (PRD Section 5.3.4) :**
- Bouton toggle ❤️/💔
- Compteur "XXX favorites"
- Model Favorite (unique [templateId, userId])
- Page /user/favorites

**Statut actuel :** ❌ Aucun système de likes

**Travail requis :**
1. Model Favorite
2. Server Action toggleFavorite
3. Composant FavoriteButton (client)
4. Page /user/favorites

### 5.5 Section "More from this creator" - ABSENTE

**Requis :**
- Afficher 3-4 autres templates du même créateur
- Carousel horizontal

**Statut actuel :** ❌ Absent

### 5.6 Section "Similar templates" - ABSENTE (optionnel V1)

---

## 💰 6. PAIEMENT & TÉLÉCHARGEMENT

### 6.1 Checkout - PRÉSENT (à adapter)

**Actuellement :**
- ✅ Stripe Checkout fonctionnel
- ✅ Stripe Connect pour paiements vendeurs
- ✅ Webhook checkout.session.completed
- ✅ Email de livraison produit

**À adapter :**
- 🟡 Créer Order record en DB (actuellement pas de tracking)
- 🟡 Lier Order à buyerId + templateId + paymentIntentId
- 🟡 Rediriger vers /purchase/success et /purchase/cancel (actuellement /payment/*)

### 6.2 Page téléchargement - ABSENTE

**Requis (PRD Section 5.4) :**
- `/download/[orderId]`
- Access control : vérifier order.buyerId = currentUser.id
- Liste de liens de téléchargement :
  - HTML files
  - ZIP projet Vite/Next.js
  - Assets

**Statut actuel :**
- ❌ Pas de page dédiée
- ❌ Téléchargement uniquement via email
- ❌ Pas de vérification owner

**Travail requis :**
1. Route `/download/[orderId]/page.tsx`
2. Vérification session + ownership
3. Lister files depuis TemplateFile
4. Liens de téléchargement sécurisés (signed URLs ou proxy)

### 6.3 Page Favoris - ABSENTE

**Requis :**
- `/user/favorites`
- Liste templates likés
- Possibilité d'unliker

**Statut actuel :** ❌ Absent

---

## 👨‍💼 7. FONCTIONNALITÉS CRÉATEUR

### 7.1 Dashboard - BASIQUE

**Actuellement présent :**
- ✅ `/my-products` : liste des produits du créateur
- ✅ `/billing` : Stripe Connect management

**Manquant (PRD Section 6.1) :**
- ❌ Stats globales :
  - Total ventes
  - Revenus cumulés (gross + share créateur)
  - Rating moyen global
  - Total favoris
- ❌ Tableau templates enrichi :
  - Statut (DRAFT/PENDING/PUBLISHED/REJECTED)
  - Vues
  - Ventes
  - Rating
  - Likes
  - Actions : éditer, voir, supprimer

**Requis :** Renommer/enrichir `/my-products` → `/creator/dashboard`

### 7.2 Formulaire "New Template" - INSUFFISANT

**Actuellement présent :**
- ✅ Name, Category (simple select), Price
- ✅ Small Description (textarea)
- ✅ Description (TipTap rich text)
- ✅ Images upload (UploadDropzone, max 5)
- ✅ Product file upload (ZIP)

**Manquant (PRD Section 6.3) :**

#### Section Visuels
- 🟡 Min 2 images obligatoires (validation actuelle ?)
- 🟡 Max 4 images (actuellement 5)

#### Section Infos de base
- ❌ **Byline** (sous-titre optionnel, ~80 caractères)

#### Section Classification (🔴 MAJEUR)
- ❌ **Categories** : multi-select (0/3) au lieu de single select
- ❌ **Styles** : multi-select (0/5)
- ❌ **Subcategories** : multi-select (0/6), filtrées dynamiquement
- ❌ **Tags** : input tags avec chips + autocomplete

#### Section Tech & IA (🔴 CRITIQUE)
- ❌ **Tech Stack** : radio HTML / React Vite / Next.js
- ❌ **Compatible AI Platforms** : multi-select (v0, Lovable, etc.)

#### Section Fichiers (🔴 COMPORTEMENT CONDITIONNEL)
**Si HTML :**
- ❌ Dropzone multi-fichiers (.html, .css, .js, images)
- ❌ Liste fichiers uploadés
- ❌ Bouton "Set as preview" sur chaque HTML file
- ❌ Obligation : au moins 1 HTML + 1 previewFile sélectionné

**Si React Vite / Next.js :**
- ✅ Dropzone ZIP (présent)
- ❌ Champ **Live demo URL** (obligatoire)
- ❌ Validation URL

**Actuellement :** Upload générique ZIP, pas de distinction

#### Section Pricing
- ✅ Prix numérique présent
- ❌ Toggle Paid ON/OFF (pour templates gratuits)

#### Section Full Description
- ✅ TipTap editor présent
- 🟡 Vérifier rich text features (bold, italic, listes, liens)

#### Actions
- ✅ Création produit fonctionnelle
- ❌ **Save as Draft** : créer en status DRAFT
- ❌ **Publish** : soumettre en PENDING (modération admin)

**Statut actuel du formulaire :**
- Route : `/sell` ✅
- Form : `SellForm` composant ✅
- Mais : manque 80% des champs/logique PRD 🔴

### 7.3 Édition template - ABSENTE

**Requis :**
- `/creator/templates/[id]/edit`
- Même formulaire que création, pré-rempli
- Si template PUBLISHED modifié → repasse PENDING (modération)

**Statut actuel :** ❌ Aucune route d'édition

### 7.4 Profil créateur - BASIQUE

**Actuellement :**
- ✅ `/settings` : édition firstName, lastName
- ❌ Pas de champs username, bio, avatarUrl

**Requis :**
- `/creator/profile` : gérer nom public, username, bio, avatar
- Intégration Stripe Connect (déjà présent dans /billing ✅)

### 7.5 Page publique créateur - ABSENTE

**Requis (PRD Section 6.6) :**
- `/creator/[username]`
- Avatar, nom, bio
- Styles & catégories dominants (stats agrégées)
- Stats :
  - Rating moyen global
  - Total likes sur tous templates
- Liste templates publiés :
  - Filtres par style, catégorie, stack, plateforme

**Statut actuel :** ❌ Aucune page publique créateur

**Travail requis :**
1. Ajouter username unique à User
2. Route `/creator/[username]/page.tsx`
3. Query templates du créateur avec filters
4. Affichage stats agrégées
5. Grille templates filtrables

---

## 🛡️ 8. FONCTIONS ADMIN - TOTALEMENT ABSENTES

### 8.1 Dashboard admin - ABSENT

**Requis (PRD Section 7.1) :**
- `/admin/page.tsx`
- Vue globale :
  - Nb templates par statut (DRAFT/PENDING/PUBLISHED/REJECTED)
  - Nb ventes
  - Top templates
  - **Liste templates en PENDING** (priorité modération)

**Statut actuel :** ❌ Aucune interface admin

### 8.2 Gestion templates - ABSENTE

**Requis (PRD Section 7.2) :**
- `/admin/templates` : liste tous templates
- `/admin/templates/[id]` : détail template
- Voir toutes métadonnées (styles, catégories, etc.)
- Actions :
  - **Approve** (→ PUBLISHED)
  - **Reject** (→ REJECTED, avec message optionnel)

**Statut actuel :** ❌ Aucune fonctionnalité

**Dépendances :**
- Enum TemplateStatus
- User.role = ADMIN
- Middleware de protection routes admin

### 8.3 Gestion reviews - ABSENTE

**Requis (PRD Section 7.3) :**
- `/admin/reviews` : liste toutes reviews
- Filtres : par template, score, date
- Action : supprimer review abusive

**Statut actuel :** ❌ Pas de reviews = pas de gestion

### 8.4 Protection routes admin - ABSENTE

**Requis :**
- Middleware vérifiant User.role = ADMIN
- Redirections si non autorisé

**Statut actuel :** ❌ Pas de notion de rôles

---

## 🗺️ 9. ARCHITECTURE & ROUTING

### 9.1 Routes manquantes

**Structure cible (PRD Section 8) :**

```
app/
  ✅ page.tsx                          → Home (à enrichir)
  ❌ templates/
    ❌ page.tsx                       → Explorer (ABSENT)
    ❌ [slug]/page.tsx                → Template detail (actuellement /product/[id])

  ❌ creator/
    ❌ [username]/page.tsx            → Public creator page
    ❌ dashboard/page.tsx             → Creator dashboard (actuellement /my-products)
    ❌ templates/page.tsx             → Liste templates créateur
    ❌ templates/new/page.tsx         → New template (actuellement /sell)
    ❌ templates/[id]/edit/page.tsx   → Edit template
    ❌ profile/page.tsx                → Manage profile (actuellement /settings)

  ❌ user/
    ❌ favorites/page.tsx             → Favoris

  🟡 purchase/
    ❌ success/page.tsx               → Success (actuellement /payment/success)
    ❌ cancel/page.tsx                → Cancel (actuellement /payment/cancel)

  ❌ download/[orderId]/page.tsx      → Téléchargement sécurisé

  ❌ admin/
    ❌ page.tsx                       → Admin dashboard
    ❌ templates/page.tsx             → Templates list
    ❌ templates/[id]/page.tsx        → Template detail admin
    ❌ reviews/page.tsx               → Reviews list
    ❌ reviews/[id]/page.tsx          → Review detail

  🟡 api/
    ✅ webhooks/stripe/route.ts       → Existe (à vérifier vs PRD)
    ❌ ai/suggest-templates/route.ts  → IA recommendations
```

**Routes actuelles à renommer/migrer :**
- `/product/[id]` → `/templates/[slug]`
- `/products/[category]` → intégrer dans `/templates` avec filtres
- `/sell` → `/creator/templates/new`
- `/my-products` → `/creator/dashboard`
- `/settings` → `/creator/profile`
- `/payment/*` → `/purchase/*`

### 9.2 API Routes manquantes

- ❌ `/api/ai/suggest-templates` (IA)
- ❌ `/api/reviews` (CRUD reviews)
- ❌ `/api/favorites` (toggle like)
- ❌ `/api/templates/[slug]` (get by slug vs ID)

---

## 📦 10. GESTION DES FICHIERS

### 10.1 Upload system - INSUFFISANT

**Actuellement :**
- ✅ UploadThing intégré
- ✅ imageUploader (max 5 images, 4MB)
- ✅ productFileUpload (1 ZIP)

**Requis (PRD Section 6.3.5) :**

#### Pour HTML templates :
- ❌ Upload multi-fichiers individuels (.html, .css, .js, .png, etc.)
- ❌ Liste des fichiers uploadés affichée
- ❌ Sélection d'un HTML comme previewFile
- ❌ Stockage dans TemplateFile avec fileType

#### Pour React/Next templates :
- ✅ Upload ZIP (présent)
- ❌ Champ liveDemoUrl requis
- ❌ Validation URL

### 10.2 Téléchargement - INSÉCURISÉ

**Actuellement :**
- Email avec lien direct UploadThing
- Pas de vérification ownership

**Requis :**
- Page /download/[orderId] avec auth
- Vérification order belongs to user
- Liste des fichiers disponibles
- Signed URLs ou proxy pour sécurité

---

## 🎨 11. COMPOSANTS UI

### 11.1 Composants manquants

**Pour la homepage :**
- ❌ `AITemplateFinder.tsx` (Hero avec textarea IA)
- ❌ `StyleChips.tsx` (Popular styles)
- ❌ `CategoryCards.tsx` (3 grandes cartes avec descriptions)
- ❌ `PlatformBand.tsx` (Bande icônes plateformes IA)
- ❌ `FeaturedCreators.tsx` (Créateurs mis en avant)

**Pour /templates :**
- ❌ `FilterBar.tsx` (barre de filtres complète)
- ❌ `TemplateGrid.tsx` (grille avec pagination)
- ❌ `SortDropdown.tsx` (tri multiple)

**Pour template detail :**
- ❌ `HTMLPreview.tsx` (iframe sandbox)
- ❌ `LiveDemoButton.tsx`
- ❌ `ReviewList.tsx` + `ReviewForm.tsx`
- ❌ `FavoriteButton.tsx` (toggle like)
- ❌ `RatingStars.tsx` (affichage + input rating)
- ❌ `MoreFromCreator.tsx` (carousel)

**Pour formulaire template :**
- ❌ `StyleSelector.tsx` (multi-select styles)
- ❌ `SubcategorySelector.tsx` (filtrée par catégories)
- ❌ `TagInput.tsx` (input chips avec autocomplete)
- ❌ `PlatformSelector.tsx` (multi-select plateformes)
- ❌ `TechStackRadio.tsx` (HTML/Vite/Next)
- ❌ `ConditionalFileUpload.tsx` (comportement selon techStack)
- ❌ `HTMLFileList.tsx` (liste fichiers avec "set as preview")

**Pour admin :**
- ❌ `AdminTemplateTable.tsx`
- ❌ `ModerationActions.tsx` (Approve/Reject)
- ❌ `ReviewModerationTable.tsx`
- ❌ `AdminStats.tsx`

### 11.2 Composants existants à adapter

- 🟡 `ProductCard.tsx` → enrichir avec styles, rating, likes, techStack, platforms
- 🟡 `ProductRow.tsx` → adapter pour nouveaux critères de tri/filtrage
- 🟡 `SelectCategory.tsx` → transformer en multi-select + ajouter subcategories
- 🟡 `Navbar.tsx` → ajouter lien /templates, /creator/dashboard, /admin (si admin)

---

## 🔐 12. SÉCURITÉ & PERMISSIONS

### 12.1 Rôles utilisateurs - ABSENT

**Requis :**
- enum UserRole { USER, CREATOR, ADMIN }
- User.role en DB
- Middleware de vérification rôle

**Statut actuel :** ❌ Tous users identiques

### 12.2 Modération templates - ABSENTE

**Workflow requis :**
1. Créateur crée template → status = DRAFT
2. Créateur clique "Publish" → status = PENDING
3. Admin review → PUBLISHED ou REJECTED
4. Si PUBLISHED puis édité → retour PENDING

**Statut actuel :** 
- ❌ Tous produits publiés immédiatement
- ❌ Pas de workflow de validation

### 12.3 Contrôle d'accès

**Requis :**
- Reviews : uniquement si Order exists
- Download : vérifier order ownership
- Edit template : uniquement créateur propriétaire
- Admin routes : uniquement role ADMIN
- Delete : uniquement créateur ou admin

**Statut actuel :** 
- 🟡 Auth Kinde fonctionnelle
- ❌ Pas de vérifications fines de permissions

---

## 📊 13. DONNÉES SEEDER & INITIALES

### 13.1 Données de référence à créer

**Requis :**
1. **14 StyleTags** (clean-minimal, dark-saas, pastel-playful, etc.)
2. **3 Categories** avec descriptions :
   - Marketing & Landing
   - Product & App UI
   - Dashboard & Analytics
3. **~20 Subcategories** liées aux catégories
4. **Tags suggérés** (auth, saas-b2b, ecommerce, etc.)
5. **10 PlatformTypes** (enum déjà défini)

**Statut actuel :**
- ❌ Aucun seeder prévu
- ❌ Pas de données initiales

**Travail requis :**
- Script `prisma/seed.ts`
- Ajouter `prisma db seed` au package.json

---

## 🧪 14. FEATURES OPTIONNELLES V1 (mentionnées mais non critiques)

- 🟡 Section "Similar templates" sur page detail (optionnel)
- 🟡 Section "Créateurs mis en avant" sur homepage (optionnel)
- 🟡 Multi-devises (hors scope V1, USD uniquement OK)

---

## 📈 15. ANALYTICS & KPIs (non implémenté mais requis pour suivi produit)

**Requis (PRD Section 3.2) :**
- Tracking vues templates
- Tracking conversions preview → achat
- CTR sur résultats IA
- Taux d'ajout aux favoris

**Statut actuel :** ❌ Aucun analytics

**Recommandation :** Intégrer après MVP (Vercel Analytics, PostHog, etc.)

---

## 🎯 16. PRIORISATION DES ÉCARTS

### 🔴 CRITIQUE (Bloquants MVP) - Priorité 1

1. **Modèle de données complet**
   - Ajouter tous les enums (TemplateStatus, TechStack, FileType, PlatformType, UserRole)
   - Créer models : StyleTag, Category, Subcategory, Tag, TemplatePlatform, TemplateFile, Order, Review, Favorite
   - Enrichir User (username, bio, role)
   - Enrichir Template (slug, status, techStack, ratings, etc.)

2. **Système de classification**
   - Styles (5 par template)
   - Catégories multi-select (3 max)
   - Sous-catégories (6 max)
   - Tags
   - Plateformes IA

3. **Workflow de modération**
   - Status DRAFT/PENDING/PUBLISHED/REJECTED
   - Interface admin basique
   - Actions Approve/Reject

4. **Tech Stack & Previews**
   - Différenciation HTML / React Vite / Next.js
   - HTML preview (iframe sandbox)
   - Live demo URL pour Vite/Next

5. **Formulaire création template complet**
   - Tous les champs classification
   - Upload conditionnel selon techStack
   - Save as Draft vs Publish

### 🟡 IMPORTANT (Nécessaires V1) - Priorité 2

6. **Reviews & Ratings**
   - Model Review
   - Formulaire + liste reviews
   - Calcul ratings moyens

7. **Favorites / Likes**
   - Model Favorite
   - Toggle like
   - Page /user/favorites

8. **Orders & Downloads sécurisés**
   - Model Order
   - Page /download/[orderId]
   - Vérification ownership

9. **Page Explorer /templates**
   - Filtres avancés
   - Tri multiple
   - Grille + pagination

10. **Profil créateur public**
    - Route /creator/[username]
    - Stats agrégées
    - Liste templates publics

### 🟢 SOUHAITABLE (Nice-to-have V1) - Priorité 3

11. **AI Template Finder**
    - Endpoint /api/ai/suggest-templates
    - Embeddings + similarité
    - UI hero homepage

12. **Homepage enrichie**
    - Styles populaires
    - Plateformes IA band
    - Créateurs featured

13. **Section "More from creator"**
    - Sur page template detail

14. **Édition templates**
    - Route /creator/templates/[id]/edit

### ⚪ OPTIONNEL V1 - Priorité 4

15. **Similar templates**
16. **Analytics avancés**
17. **Admin reviews moderation**

---

## 📊 17. ESTIMATION DE L'EFFORT

### Par domaine fonctionnel :

| Domaine | Effort (jours dev) | Complexité |
|---------|-------------------|------------|
| **Migrations DB + Models** | 3-5 | Moyenne |
| **Système classification** | 5-7 | Élevée |
| **Formulaire template complet** | 4-6 | Moyenne |
| **Previews (HTML + live demo)** | 3-4 | Moyenne |
| **Reviews & Ratings** | 3-4 | Moyenne |
| **Favorites / Likes** | 2-3 | Faible |
| **Orders & Downloads** | 2-3 | Faible |
| **Page Explorer /templates** | 4-5 | Moyenne |
| **Admin (modération)** | 5-7 | Élevée |
| **Profil créateur public** | 3-4 | Moyenne |
| **AI Template Finder** | 7-10 | Très élevée |
| **Homepage enrichie** | 3-4 | Moyenne |
| **Routing refactor** | 2-3 | Faible |
| **UI Components** | 10-15 | Élevée |
| **Testing & Debug** | 5-7 | - |

**Total estimé : 60-85 jours de développement**
(Environ 3-4 mois pour 1 développeur full-time)

---

## ✅ 18. CHECKLIST DE MISE EN ŒUVRE

### Phase 1 : Fondations (Semaines 1-3)
- [ ] Créer toutes les migrations Prisma
- [ ] Définir tous les enums
- [ ] Créer tous les models manquants
- [ ] Seeder données initiales (styles, catégories, etc.)
- [ ] Refactorer routing (/templates, /creator/*, /admin/*)
- [ ] Ajouter User.role et middleware protection

### Phase 2 : Classification & Formulaire (Semaines 4-6)
- [ ] UI multi-select styles
- [ ] UI multi-select catégories + sous-catégories
- [ ] UI tags input avec autocomplete
- [ ] UI plateformes IA selector
- [ ] UI tech stack radio
- [ ] Upload conditionnel (HTML multi-files vs ZIP)
- [ ] Intégrer tous champs dans formulaire création
- [ ] Workflow DRAFT → PENDING → PUBLISHED

### Phase 3 : Pages Core (Semaines 7-9)
- [ ] Page /templates avec filtres avancés
- [ ] Enrichir page template detail (styles, tags, rating, etc.)
- [ ] Implémenter previews (HTML iframe + live demo)
- [ ] Page /creator/[username]
- [ ] Page /creator/dashboard avec stats

### Phase 4 : Social & Moderation (Semaines 10-12)
- [ ] System reviews & ratings complet
- [ ] System favorites / likes
- [ ] Orders tracking
- [ ] Page /download/[orderId]
- [ ] Interface admin /admin/*
- [ ] Modération templates (Approve/Reject)

### Phase 5 : IA & Polish (Semaines 13-15)
- [ ] Endpoint /api/ai/suggest-templates
- [ ] AI Template Finder sur homepage
- [ ] Homepage blocs enrichis
- [ ] Édition templates
- [ ] More from creator section
- [ ] Tests end-to-end
- [ ] Documentation

---

## 📝 19. NOTES TECHNIQUES IMPORTANTES

### 19.1 Migrations Prisma
⚠️ Les migrations vont modifier significativement le schéma :
- Renommer `Product` → `Template` ?
- Ajouter ~10 nouvelles tables
- Données existantes à migrer (scripts de migration)

### 19.2 Breaking Changes
🔴 Changements cassants pour données existantes :
- URLs produits changent (ID → slug)
- Catégories changent (template/uikit/icon → nouveau système)
- Structure fichiers change

**Recommandation :** Si données de prod existantes, prévoir scripts migration + redirects.

### 19.3 Dépendances externes
📦 Nouvelles dépendances potentielles :
- **IA embeddings** : @vercel/ai, openai, ou similar
- **Vector DB** : Pinecone, Supabase pgvector, ou fallback hybrid search
- **Rich tags input** : react-tag-input ou custom component

### 19.4 Performance
⚡ Points d'attention :
- Indexes DB sur colonnes filtrées (techStack, status, etc.)
- Pagination obligatoire sur listes (pas de fetch all)
- Cache queries fréquentes (styles list, categories)
- CDN pour previews HTML (sécurité + perf)

### 19.5 Sécurité
🔒 Nouvelles surfaces d'attaque :
- **HTML preview** : sandbox strict, CSP headers
- **Live demo URLs** : validation + whitelist domains ?
- **Upload multi-files** : validation MIME types stricte
- **Admin routes** : double vérification role

---

## 🎬 20. CONCLUSION

### État actuel
L'application actuelle est une **marketplace générique fonctionnelle** avec :
- ✅ Auth, paiements, uploads de base
- ✅ CRUD produits simple
- ✅ Structure Next.js 14 solide

### Gap principal
Le PRD cible un **produit spécialisé** nécessitant :
- 🔴 ~80% des fonctionnalités métier manquantes
- 🔴 Modèle de données 3-4x plus complexe
- 🔴 UX et workflows entièrement différents

### Viabilité
Le projet est **faisable** mais représente un **développement quasi-complet** (3-4 mois).

### Recommandation stratégique
1. **Si budget limité** : Implémenter phases 1-3 (MVP simplifié sans IA)
2. **Si ambition complète** : Suivre roadmap 5 phases
3. **Approche hybride** : MVP phase 1-2 + IA en phase 2 (plus risqué)

---

**Document généré le :** 3 décembre 2025  
**Version :** 1.0  
**Auteur :** AI Analysis System
