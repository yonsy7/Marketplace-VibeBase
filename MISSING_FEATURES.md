# Fonctionnalités Manquantes - VibeBase Marketplace V1

## Document de comparaison : Code actuel vs PRD

Ce document liste toutes les fonctionnalités manquantes entre l'implémentation actuelle et les spécifications du PRD V1.

---

## 📋 Table des matières

1. [Modèle de données](#modèle-de-données)
2. [Fonctionnalités côté acheteurs](#fonctionnalités-côté-acheteurs)
3. [Fonctionnalités côté créateurs](#fonctionnalités-côté-créateurs)
4. [Fonctionnalités admin](#fonctionnalités-admin)
5. [Système de classification](#système-de-classification)
6. [Système d'IA](#système-dia)
7. [Système de reviews et ratings](#système-de-reviews-et-ratings)
8. [Système de favoris/likes](#système-de-favorislikes)
9. [Système de prévisualisation](#système-de-prévisualisation)
10. [Système de téléchargement](#système-de-téléchargement)
11. [Workflow de modération](#workflow-de-modération)
12. [Pages et routes manquantes](#pages-et-routes-manquantes)

---

## 1. Modèle de données

### ❌ Modèles manquants dans Prisma Schema

#### 1.1 Template Model (remplace Product)
**Actuel:** `Product` avec champs basiques
**Requis:** `Template` avec :
- `slug` (unique, pour URLs SEO-friendly)
- `byline` (optionnel, ~80 caractères)
- `shortDesc` (max 260 caractères)
- `longDesc` (rich text)
- `status` (enum: DRAFT, PENDING, PUBLISHED, REJECTED)
- `techStack` (enum: HTML, REACT_VITE, NEXTJS)
- `previewFileId` (référence vers TemplateFile pour HTML preview)
- `previewImages` (JSON array, 2-4 images)
- `liveDemoUrl` (pour React/Next.js templates)
- `ratingAverage` (Float, calculé)
- `ratingCount` (Int)
- `likeCount` (Int)
- `viewCount` (Int, pour analytics)

#### 1.2 TemplateFile Model
**Manquant complètement**
```prisma
model TemplateFile {
  id          String   @id @default(cuid())
  templateId  String
  fileUrl     String
  fileType    FileType  // enum: HTML, PROJECT_ZIP, CSS, JS, ASSET
  fileName    String
  template    Template @relation(fields: [templateId], references: [id])
}
```

#### 1.3 StyleTag & TemplateStyleTag
**Manquant complètement**
- `StyleTag` model avec noms uniques (clean-minimal, dark-saas, etc.)
- `TemplateStyleTag` (relation many-to-many)
- Limite: 5 styles par template

#### 1.4 Category & Subcategory Models
**Actuel:** Simple enum `CategoryTypes` (template, uikit, icon)
**Requis:** 
- `Category` model (Marketing & Landing, Product & App UI, Dashboard & Analytics)
- `Subcategory` model (lié à Category)
- `TemplateCategory` (many-to-many, max 3)
- `TemplateSubcategory` (many-to-many, max 6)

#### 1.5 Tag & TemplateTag
**Manquant complètement**
- `Tag` model (mots-clés libres)
- `TemplateTag` (many-to-many)

#### 1.6 TemplatePlatform
**Manquant complètement**
- `PlatformType` enum (V0, LOVABLE, SUBFRAME, MAGIC_PATTERNS, etc.)
- `TemplatePlatform` model (many-to-many)

#### 1.7 Order Model
**Actuel:** Pas de modèle Order
**Requis:**
```prisma
model Order {
  id                 String   @id @default(cuid())
  buyerId            String
  templateId         String
  paymentIntentId    String   @unique
  downloadAvailable  Boolean  @default(false)
  createdAt          DateTime @default(now())
  buyer              User     @relation(...)
  template           Template @relation(...)
}
```

#### 1.8 Review Model
**Manquant complètement**
```prisma
model Review {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  rating      Int      // 1-5
  comment     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  template    Template @relation(...)
  user        User     @relation(...)
  
  @@unique([templateId, userId]) // 1 review par user/template
}
```

#### 1.9 Favorite Model
**Manquant complètement**
```prisma
model Favorite {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  createdAt   DateTime @default(now())
  template    Template @relation(...)
  user        User     @relation(...)
  
  @@unique([templateId, userId])
}
```

#### 1.10 User Model - Champs manquants
**Actuel:** Champs basiques
**Manquants:**
- `username` (unique, pour URLs publiques)
- `bio` (description créateur)
- `avatarUrl` (optionnel, actuellement `profileImage`)
- `role` (enum: USER, CREATOR, ADMIN)

#### 1.11 Enums manquants
- `TemplateStatus` (DRAFT, PENDING, PUBLISHED, REJECTED)
- `TechStack` (HTML, REACT_VITE, NEXTJS)
- `FileType` (HTML, PROJECT_ZIP, CSS, JS, ASSET)
- `PlatformType` (V0, LOVABLE, SUBFRAME, MAGIC_PATTERNS, UIZARD, ONLOOK, REPLIT, AURA_BUILD, MAGIC_PATH, STITCH)
- `UserRole` (USER, CREATOR, ADMIN)

---

## 2. Fonctionnalités côté acheteurs

### ❌ Page d'accueil (Homepage)

#### 2.1 Bloc 1 — AI Template Finder (Hero)
**Manquant complètement**
- Textarea full-width avec placeholder IA
- Bouton "Trouver mes templates"
- Endpoint `/api/ai/suggest-templates` (POST)
- Affichage de 3-6 templates recommandés avec:
  - Image principale
  - Nom
  - Style principal
  - Catégories principales
  - Stack (HTML/Vite/Next.js)
  - Plateformes IA (icônes)
  - Prix
  - Note moyenne
  - Nombre de likes
- États: loading (skeletons), erreur, aucun résultat

#### 2.2 Bloc 2 — Styles populaires
**Manquant complètement**
- Titre "Popular styles"
- Chips de styles cliquables
- Filtre vers `/templates?style=clean-minimal`

#### 2.3 Bloc 3 — Catégories
**Actuel:** Simple navigation
**Requis:** 3 grandes cartes:
- Marketing & Landing
- Product & App UI
- Dashboard & Analytics
- Chaque carte: icône, description, CTA "Browse"

#### 2.4 Bloc 4 — Plateformes IA
**Manquant complètement**
- Bande d'icônes (v0.dev, Lovable, Subframe, etc.)
- Clic → `/templates?platform=V0`

#### 2.5 Bloc 5 — Templates populaires
**Actuel:** `ProductRow` avec catégories simples
**Requis:** Algorithme de popularité basé sur:
- Ventes
- Likes
- Vues
- Rating moyen
- Affichage de 4-8 templates

#### 2.6 Bloc 6 — Nouveaux templates
**Actuel:** `ProductRow category="newest"`
**Requis:** Derniers templates PUBLISHED (4-8)

#### 2.7 Bloc 7 — Créateurs mis en avant
**Manquant complètement**
- 2-4 profils créateurs
- Stats (nb templates, rating moyen)
- Lien vers page créateur

### ❌ Page Explorer `/templates`

**Actuel:** `/products/[category]` avec filtres basiques
**Requis:** Page complète avec:

#### 2.8 Barre de filtres avancée
- **Styles** (multi-select, jusqu'à 5)
- **Catégories** (multi-select, jusqu'à 3)
- **Sous-catégories** (filtrées par catégories sélectionnées, multi-select jusqu'à 6)
- **Tags** (recherche/suggestions)
- **Tech Stack** (HTML / React Vite / Next.js)
- **IA Platforms** (multi-select)
- **Prix** (free / paid / range slider)

#### 2.9 Système de tri
- Récent
- Populaire
- Prix croissant/décroissant
- Meilleure note
- Plus likés

#### 2.10 Pagination / Infinite Scroll
**Actuel:** Affichage simple
**Requis:** Pagination ou infinite scroll

### ❌ Page Template `/templates/[slug]`

**Actuel:** `/product/[id]` avec structure basique
**Requis:** Page complète avec:

#### 2.11 Header enrichi
- Nom du template
- Byline (optionnel)
- Prix (ou badge "Free")
- **Styles** (liste de badges)
- **Catégories & sous-catégories** (badges)
- **Tags** (chips)
- **Tech stack** (badge)
- **Plateformes IA** (icônes)
- **Moyenne de rating** + nb reviews
- **Nombre de likes**
- **Créateur** (avatar + nom) → lien `/creator/[username]`

#### 2.12 Système de prévisualisation
**Manquant complètement**
- Si `techStack = HTML`: iframe sandbox avec `previewFileId`
- Si `techStack = REACT_VITE` ou `NEXTJS`: iframe sur `liveDemoUrl` + bouton "Open live demo"

#### 2.13 Contenu enrichi
**Actuel:** Carousel images + description
**Requis:**
- Carousel de screenshots (2-4 images max depuis `previewImages`)
- Short description (`shortDesc`)
- Full description (`longDesc` en rich text)
- Liste des fichiers inclus (depuis `TemplateFile`)

#### 2.14 Likes / Favoris
**Manquant complètement**
- Bouton toggle "❤️ Add to favorites" / "💔 Remove from favorites"
- Compteur "XXX favorites"
- Fonctionnalité backend (create/delete Favorite)

#### 2.15 Reviews & Ratings
**Manquant complètement**
- Sommaire: moyenne ★ 1-5, nb de reviews
- Liste des reviews:
  - Nom user
  - Rating
  - Commentaire
  - Date
- Pagination / lazy load
- Formulaire "Ajouter une review":
  - Accessible uniquement si user a au moins une Order sur ce Template
  - 1 review par user/template (édition possible)
  - Champs: rating (1-5), commentaire (optionnel)

#### 2.16 CTAs & cross-selling
**Actuel:** Bouton "Buy" simple
**Requis:**
- Bouton principal "Buy template"
- Section "More from this creator"
- (Optionnel V1) Section "Similar templates"

### ❌ Paiement & téléchargement

#### 2.17 Page `/download/[orderId]`
**Manquant complètement**
- Access control: vérifie que `order.buyerId = currentUser.id`
- Liste de liens de téléchargement:
  - HTML files
  - ZIP projet Vite / Next.js
  - Assets
- Gestion des fichiers depuis `TemplateFile`

#### 2.18 Mise à jour Order après paiement
**Actuel:** Webhook envoie email avec lien
**Requis:** 
- Créer `Order` dans DB avec `downloadAvailable = true`
- Lier `paymentIntentId` à l'Order
- Rediriger vers `/download/[orderId]` après succès

### ❌ Page Favoris `/user/favorites`
**Manquant complètement**
- Liste de tous les templates likés par l'utilisateur
- Cartes pointant vers `/templates/[slug]`
- Possibilité de retirer/unlike depuis la liste

---

## 3. Fonctionnalités côté créateurs

### ❌ Dashboard `/creator/dashboard`
**Manquant complètement**

#### 3.1 Section Stats
- Total ventes
- Revenus cumulés (gross + share créateur)
- Rating moyen
- Total favoris

#### 3.2 Tableau de templates
- Titre
- Statut (DRAFT / PENDING / PUBLISHED / REJECTED)
- Vues
- Ventes
- Rating
- Likes
- Actions: éditer, voir

### ❌ Liste templates `/creator/templates`
**Actuel:** `/my-products` avec vue simple
**Requis:** 
- Vue liste simplifiée
- Tri par statut / date
- Filtres par statut

### ❌ Formulaire "New Template" `/creator/templates/new`
**Actuel:** `/sell` avec formulaire basique
**Requis:** Formulaire complet avec:

#### 3.3 Section Visuels
- Titre "Visuals"
- Dropzone images: 0/4
- Min: 2 images, Max: 4 images
- Validation

#### 3.4 Section Infos de base
- **Name** (obligatoire, ~50 caractères)
- **Byline** (optionnel, ~80 caractères)
- **Short Description** (obligatoire, max 260 caractères)

#### 3.5 Section Classification
- **Categories** (multi-select, 0/3)
  - Marketing & Landing
  - Product & App UI
  - Dashboard & Analytics
- **Styles** (multi-select, 0/5)
  - Liste contrôlée (clean-minimal, dark-saas, etc.)
- **Subcategories** (multi-select, 0/6)
  - Options filtrées par catégories sélectionnées
- **Tags**: input tags (chips), suggestions + saisie libre

#### 3.6 Section Tech & IA
- **Tech Stack** (radio ou select):
  - HTML
  - React (Vite)
  - Next.js
- **Compatible AI Platforms** (multi-select):
  - v0.dev, Lovable, Subframe, Magic Patterns, Uizard, Onlook, Replit Design Mode, Aura.build, MagicPath, Stitch, etc.

#### 3.7 Section Fichiers (obligatoire)
**Comportement dépendant de TechStack:**

**Si HTML:**
- Dropzone multi-fichiers (.html, .css, .js, images)
- Liste des fichiers uploadés
- Sur chaque fichier HTML: bouton "Set as preview"
- Obligation: au moins un fichier HTML, et un `previewFile` sélectionné

**Si React Vite ou Next.js:**
- Dropzone pour un fichier .zip
- Champ "Live demo URL" (obligatoire)
- Validation: .zip présent, URL valide

#### 3.8 Section Pricing
- Toggle "Paid"
- OFF → template gratuit (prix = 0)
- ON → champ Price (numeric, en euros ou cents)

#### 3.9 Section Full Description
- Rich text editor (paragraphe, bold, italic, listes, liens)
- Map vers `longDesc`

#### 3.10 Actions
- Bouton "Save as Draft" → statut DRAFT
- Bouton "Publish" → statut PENDING (soumission à modération)

### ❌ Edition `/creator/templates/[id]/edit`
**Manquant complètement**
- Même structure que `/new`
- Chargement des champs existants
- Mêmes validations
- Si template PUBLISHED modifié → repasser en PENDING (recommandé V1)

### ❌ Profil créateur `/creator/profile`
**Manquant complètement**
- Gérer:
  - Nom public / username
  - Bio courte
  - Avatar image
- Intégration Stripe Connect (lien vers le flow Stripe)

### ❌ Page publique créateur `/creator/[username]`
**Manquant complètement**
- Avatar, nom, bio
- Styles & catégories dominants (statistiques)
- Stats:
  - Rating moyen global
  - Total likes sur tous ses templates
- Liste des templates publiés:
  - Filtres par style, catégorie, stack, plateforme IA

---

## 4. Fonctionnalités admin

### ❌ Dashboard `/admin`
**Manquant complètement**
- Vue globale:
  - Nb templates (DRAFT/PENDING/PUBLISHED/REJECTED)
  - Nb ventes
  - Top templates
  - Liste des templates en PENDING

### ❌ Gestion templates `/admin/templates` & `/admin/templates/[id]`
**Manquant complètement**
- Voir toutes les métadonnées:
  - Styles, catégories, sous-catégories, tags
  - Stack, IA platforms
  - Fichiers, preview
- Actions:
  - Approve (→ PUBLISHED)
  - Reject (→ REJECTED, avec message optionnel)

### ❌ Gestion reviews `/admin/reviews` & `/admin/reviews/[id]`
**Manquant complètement**
- Liste de toutes les reviews
- Tri / filtre par template, score, date
- Action: supprimer une review abusive

### ❌ Système de rôles
**Manquant complètement**
- Middleware/autorisation pour routes admin
- Vérification `user.role === ADMIN`
- Protection des routes `/admin/*`

---

## 5. Système de classification

### ❌ Styles (StyleTags)
**Manquant complètement**
- Modèle `StyleTag` avec noms uniques
- Liste V1: clean-minimal, dark-saas, pastel-playful, cyberpunk, neo-brutalism, editorial-magazine, rounded-soft, warm-organic, gradient-fusion, retro-90s, futuristic-ui, dashboard-modern, mobile-first, geometric-tech
- Relation many-to-many avec Template (max 5)

### ❌ Catégories & Sous-catégories
**Actuel:** Simple enum
**Requis:** 
- Modèles `Category` et `Subcategory`
- Catégories V1:
  - Marketing & Landing
  - Product & App UI
  - Dashboard & Analytics
- Sous-catégories dépendantes (ex: SaaS, Agency, Personal brand sous Marketing & Landing)
- Relations many-to-many (max 3 catégories, max 6 sous-catégories)

### ❌ Tags
**Manquant complètement**
- Modèle `Tag` avec noms uniques
- Système de suggestions
- Input tags avec chips
- Relation many-to-many avec Template

### ❌ Plateformes IA
**Manquant complètement**
- Enum `PlatformType`
- Modèle `TemplatePlatform`
- Relation many-to-many avec Template
- Liste: V0, LOVABLE, SUBFRAME, MAGIC_PATTERNS, UIZARD, ONLOOK, REPLIT, AURA_BUILD, MAGIC_PATH, STITCH

---

## 6. Système d'IA

### ❌ Endpoint `/api/ai/suggest-templates`
**Manquant complètement**

#### 6.1 Structure
- Method: POST
- Input: `{ "query": "Landing Next.js pour un SaaS B2B, style dark minimal" }`
- Output: Array de templates avec score et explanation

#### 6.2 Logique interne V1
- Embeddings sur:
  - Titre, descriptions, styles, catégories, sous-catégories, tags
- Similarité vectorielle avec query
- Reranking en pondérant:
  - Rating moyen
  - Likes
  - Ventes (si dispo)
- Retour maximum 6 templates

#### 6.3 Intégration
- Service d'embeddings (OpenAI, Cohere, etc.)
- Base vectorielle (Pinecone, Qdrant, etc.) ou recherche sémantique PostgreSQL
- Endpoint API route Next.js

---

## 7. Système de reviews et ratings

### ❌ Modèle Review
**Manquant complètement**
- Création après achat (vérification Order)
- 1 review par user/template
- Rating 1-5
- Commentaire optionnel
- Édition possible

### ❌ Calcul rating moyen
**Manquant complètement**
- Mise à jour `template.ratingAverage` et `template.ratingCount` à chaque création/modification/suppression de review
- Trigger ou fonction Prisma

### ❌ Affichage reviews
**Manquant complètement**
- Sur page template `/templates/[slug]`
- Pagination / lazy load
- Tri par date (récent d'abord)

### ❌ Validation reviews
**Manquant complètement**
- Vérifier que user a acheté le template (Order existe)
- Empêcher plusieurs reviews par user/template

---

## 8. Système de favoris/likes

### ❌ Modèle Favorite
**Manquant complètement**
- Création/suppression Favorite
- Compteur `template.likeCount` (mise à jour automatique)

### ❌ Bouton Like/Favorite
**Manquant complètement**
- Sur page template
- Toggle fonctionnel
- État visuel (liked/unliked)

### ❌ Page Favoris
**Manquant complètement**
- Route `/user/favorites`
- Liste des templates favoris
- Possibilité de retirer depuis la liste

---

## 9. Système de prévisualisation

### ❌ Preview HTML (sandbox iframe)
**Manquant complètement**
- Si `techStack = HTML`
- Charger fichier HTML depuis `previewFileId`
- Iframe avec sandbox pour sécurité
- Gestion des assets (CSS, JS, images)

### ❌ Preview Live Demo
**Manquant complètement**
- Si `techStack = REACT_VITE` ou `NEXTJS`
- Iframe sur `liveDemoUrl`
- Bouton "Open live demo" (nouvel onglet)
- Validation URL

---

## 10. Système de téléchargement

### ❌ Page Download `/download/[orderId]`
**Manquant complètement**
- Access control (vérifier ownership)
- Liste des fichiers depuis `TemplateFile`
- Liens de téléchargement sécurisés
- Gestion des ZIP (projets Vite/Next.js)
- Gestion des fichiers HTML individuels
- Gestion des assets

### ❌ Intégration avec Orders
**Manquant complètement**
- Créer Order après paiement réussi
- Lier `paymentIntentId` à Order
- Activer `downloadAvailable = true`
- Rediriger vers `/download/[orderId]` après succès

---

## 11. Workflow de modération

### ❌ Statuts Template
**Manquant complètement**
- DRAFT (brouillon créateur)
- PENDING (soumis à modération)
- PUBLISHED (approuvé, visible publiquement)
- REJECTED (refusé, avec message optionnel)

### ❌ Transitions de statut
**Manquant complètement**
- DRAFT → PENDING (bouton "Publish")
- PENDING → PUBLISHED (admin approve)
- PENDING → REJECTED (admin reject)
- PUBLISHED → PENDING (si modification)

### ❌ Notifications créateur
**Manquant complètement**
- Email/notification quand template approuvé
- Email/notification quand template rejeté (avec raison)

---

## 12. Pages et routes manquantes

### ❌ Routes acheteurs
- `/templates` (explorer avec filtres avancés)
- `/templates/[slug]` (détail template, remplace `/product/[id]`)
- `/user/favorites` (favoris utilisateur)
- `/download/[orderId]` (téléchargement sécurisé)

### ❌ Routes créateurs
- `/creator/dashboard` (stats et vue d'ensemble)
- `/creator/templates` (liste templates créateur)
- `/creator/templates/new` (création template)
- `/creator/templates/[id]/edit` (édition template)
- `/creator/profile` (gestion profil créateur)
- `/creator/[username]` (page publique créateur)

### ❌ Routes admin
- `/admin` (dashboard admin)
- `/admin/templates` (liste templates à modérer)
- `/admin/templates/[id]` (détail template admin)
- `/admin/reviews` (gestion reviews)
- `/admin/reviews/[id]` (détail review admin)

### ❌ API Routes
- `/api/ai/suggest-templates` (POST, recherche IA)
- `/api/templates/[id]/like` (POST/DELETE, toggle favorite)
- `/api/templates/[id]/reviews` (POST, créer review)
- `/api/templates/[id]/reviews/[reviewId]` (PUT/DELETE, éditer/supprimer review)
- `/api/admin/templates/[id]/approve` (POST)
- `/api/admin/templates/[id]/reject` (POST)

---

## 13. Fonctionnalités techniques manquantes

### ❌ Slug generation
**Manquant complètement**
- Génération automatique de slug depuis titre
- Unicité garantie
- URLs SEO-friendly (`/templates/dark-saas-nextjs-starter`)

### ❌ Search & Filtering
**Actuel:** Filtrage basique par catégorie
**Requis:**
- Recherche textuelle (titre, description, tags)
- Filtres multi-critères (styles, catégories, sous-catégories, tags, stack, plateformes IA, prix)
- Tri avancé
- Pagination

### ❌ Analytics & Tracking
**Manquant complètement**
- Compteur de vues (`viewCount`)
- Tracking des clics
- Analytics créateur (ventes, revenus, performance templates)

### ❌ Email notifications
**Actuel:** Email après achat seulement
**Requis:**
- Email quand template approuvé/rejeté
- Email de bienvenue créateur
- (Optionnel) Newsletter nouveaux templates

### ❌ SEO
**Manquant complètement**
- Metadata dynamique par template
- Open Graph tags
- Structured data (Schema.org)
- Sitemap

---

## 14. Améliorations UX/UI manquantes

### ❌ Loading states
**Actuel:** Skeletons basiques
**Requis:**
- Skeletons pour recherche IA
- Loading states pour favoris
- Loading states pour reviews

### ❌ Error handling
**Manquant complètement**
- Messages d'erreur IA
- Fallback si aucun résultat IA
- Gestion erreurs upload fichiers
- Validation côté client améliorée

### ❌ Responsive design
**Actuel:** Basique
**Requis:**
- Optimisation mobile pour formulaire création
- Mobile-first pour filtres
- Carousel responsive

---

## 15. Sécurité manquante

### ❌ Access control
**Manquant complètement**
- Vérification ownership pour édition template
- Vérification ownership pour download
- Protection routes admin
- Rate limiting sur API routes

### ❌ Validation fichiers
**Manquant complètement**
- Validation type de fichier (HTML, ZIP)
- Scan malware (optionnel)
- Limite taille fichiers
- Validation URL live demo

---

## 📊 Résumé par priorité

### 🔴 Critique (MVP)
1. Migration Product → Template avec nouveaux champs
2. Système de classification (Styles, Catégories, Sous-catégories, Tags, Plateformes IA)
3. Workflow de modération (DRAFT → PENDING → PUBLISHED)
4. Système de reviews & ratings
5. Système de favoris/likes
6. Page template enrichie `/templates/[slug]`
7. Formulaire création template complet `/creator/templates/new`
8. Dashboard créateur `/creator/dashboard`
9. Page téléchargement `/download/[orderId]`
10. Dashboard admin `/admin`

### 🟡 Important (V1)
11. AI Template Finder (endpoint + UI)
12. Page explorer avec filtres avancés `/templates`
13. Page publique créateur `/creator/[username]`
14. Système de prévisualisation (HTML iframe, live demo)
15. Page favoris `/user/favorites`

### 🟢 Nice to have (Post-V1)
16. Section "Similar templates"
17. Analytics avancées
18. Notifications email complètes
19. SEO optimisé
20. Recherche sémantique avancée

---

## 📝 Notes de migration

### Migration de Product vers Template
- Créer migration Prisma pour nouveaux modèles
- Script de migration des données existantes
- Mettre à jour toutes les références dans le code
- Tester toutes les fonctionnalités existantes

### Breaking changes
- URLs changent de `/product/[id]` à `/templates/[slug]`
- Structure de données complètement différente
- Nouveaux champs obligatoires pour création template

---

*Document créé le: $(date)*
*Version PRD: V1*
*Code actuel: Marketplace basique avec Product model*
