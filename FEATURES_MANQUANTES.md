# 🔍 Fonctionnalités Manquantes - Marketplace V1

**Date**: 2024-12-03  
**État**: Analyse complète des fonctionnalités attendues vs réalisées

---

## 📊 Vue d'Ensemble

| Catégorie | Réalisé | Manquant | Progression |
|-----------|---------|----------|------------|
| **Phase 0: Préparation** | 80% | 20% | 🟢 |
| **Phase 1: Migration BDD** | 90% | 10% | 🟢 |
| **Phase 2: Classification** | 50% | 50% | 🟡 |
| **Phase 3: Routes & Pages** | 5% | 95% | 🔴 |
| **Phase 4: Espace Créateur** | 0% | 100% | 🔴 |
| **Phase 5: Explorer & Filtres** | 0% | 100% | 🔴 |
| **Phase 6: Système IA** | 10% | 90% | 🔴 |
| **Phase 7: Espace Admin** | 0% | 100% | 🔴 |
| **Phase 8: Paiement & Download** | 0% | 100% | 🔴 |
| **Phase 9: Reviews & Favoris** | 0% | 100% | 🔴 |
| **Phase 10: SEO & Polish** | 0% | 100% | 🔴 |
| **Phase 11: Tests & Déploiement** | 0% | 100% | 🔴 |

---

## 🔴 Phase 0 : Préparation - Manquants (20%)

### 0.1 Analyse & Documentation
- ⬜ **0.1.3** Lister tous les products existants à migrer
- ⬜ **0.1.5** Créer une branche Git `feature/v1-marketplace`

### 0.2 Setup Environnement
- ⬜ **0.2.1** Créer une base de données de développement séparée

---

## 🟡 Phase 1 : Migration BDD - Manquants (10%)

### 1.6 Migration & Seeds
- ⬜ **1.6.6** Exécuter le seed (`npm run db:seed`)
- ⬜ **1.6.7** Générer la migration Prisma (`npx prisma migrate dev`)

### 1.7 Migration des Données Existantes
- ⬜ **1.7.1** Créer script de migration `scripts/migrate-products.ts`
- ⬜ **1.7.2** Mapper Product → Template
  - `name` → `title`
  - `smallDescription` → `shortDesc`
  - `description` → `longDesc`
  - Générer `slug` unique
  - Définir `techStack` par défaut
  - Définir `status` = PUBLISHED
- ⬜ **1.7.3** Migrer les fichiers vers `TemplateFile`
- ⬜ **1.7.4** Exécuter la migration
- ⬜ **1.7.5** Vérifier l'intégrité des données
- ⬜ **1.7.6** Supprimer l'ancien modèle `Product` (après validation)

---

## 🟡 Phase 2 : Système de Classification - Manquants (50%)

### 2.2 Composants de Sélection
- ⬜ **2.2.1** `components/ui/multi-select.tsx`
  - Composant générique pour sélection multiple
  - Support des chips et dropdown
  
- ⬜ **2.2.2** `components/classification/StyleSelector.tsx`
  - Multi-select avec chips
  - Limite 5 styles
  - Compteur visuel (3/5)
  - Scroll horizontal sur mobile
  
- ⬜ **2.2.3** `components/classification/CategorySelector.tsx`
  - Multi-select cards
  - Limite 3 catégories
  - Affichage avec icônes
  
- ⬜ **2.2.4** `components/classification/SubcategorySelector.tsx`
  - Filtré par catégories sélectionnées
  - Limite 6 au total
  - Groupement par catégorie
  
- ⬜ **2.2.5** `components/classification/TagInput.tsx`
  - Input avec suggestions
  - Chips pour tags sélectionnés
  - Auto-complétion depuis base de données
  - Création de nouveaux tags

---

## 🔴 Phase 3 : Refactoring Routes & Pages - Manquants (95%)

### 3.1 Structure des Dossiers
- ⬜ Créer la nouvelle structure:
  ```
  app/
  ├── (public)/
  │   ├── page.tsx                    # Home
  │   ├── templates/
  │   │   ├── page.tsx                # Explorer
  │   │   └── [slug]/page.tsx         # Détail template
  │   └── creator/[username]/page.tsx # Page créateur publique
  ├── (auth)/
  │   ├── user/
  │   │   ├── favorites/page.tsx
  │   │   └── purchases/page.tsx
  │   ├── creator/
  │   │   ├── dashboard/page.tsx
  │   │   ├── templates/
  │   │   │   ├── page.tsx
  │   │   │   ├── new/page.tsx
  │   │   │   └── [id]/edit/page.tsx
  │   │   ├── profile/page.tsx
  │   │   └── billing/page.tsx
  │   └── admin/
  │       ├── page.tsx
  │       ├── templates/
  │       │   ├── page.tsx
  │       │   └── [id]/page.tsx
  │       └── reviews/page.tsx
  ├── purchase/
  │   ├── success/page.tsx
  │   └── cancel/page.tsx
  └── download/[orderId]/page.tsx
  ```

### 3.2 Middleware & Protection des Routes
- ⬜ **3.2.1** Créer `middleware.ts` pour protection des routes
  - Vérifier auth pour `/creator/*`, `/admin/*`, `/user/*`
  - Vérifier rôle ADMIN pour `/admin/*`
  - Vérifier rôle CREATOR pour `/creator/*`

### 3.3 Page d'Accueil Refonte
- ⬜ **3.3.1** `components/home/AISearchBox.tsx`
  - Textarea avec placeholder
  - Bouton "Trouver mes templates"
  - Gestion état loading
  
- ⬜ **3.3.2** `components/home/AIResultsGrid.tsx`
  - Grille de résultats IA
  - Score et explication par template
  
- ⬜ **3.3.3** `components/home/StyleChips.tsx`
  - Liste horizontale de chips styles
  - Scroll horizontal sur mobile
  - Navigation vers `/templates?style=X`
  
- ⬜ **3.3.4** `components/home/CategoryCards.tsx`
  - 3 grandes cartes
  - Icône, description, CTA
  - Navigation vers `/templates?category=X`
  
- ⬜ **3.3.5** `components/home/PlatformBanner.tsx`
  - Bande d'icônes plateformes IA
  - Navigation vers `/templates?platform=X`
  
- ⬜ **3.3.6** `components/home/PopularTemplates.tsx`
  - Grille 4-8 templates
  - Algorithme de scoring (ventes + likes + vues + rating)
  
- ⬜ **3.3.7** `components/home/NewArrivals.tsx`
  - Grille 4-8 derniers templates
  - Badge "New" si < 7 jours
  
- ⬜ **3.3.8** Refactorer `app/page.tsx` avec tous les blocs
- ⬜ **3.3.9** Mettre à jour les metadata

### 3.4 Refonte TemplateCard
- ⬜ **3.4.1** Refactorer `components/TemplateCard.tsx` (ex-ProductCard)
  - Ajouter styles badges
  - Ajouter tech stack badge
  - Ajouter rating
  - Ajouter like count
  - Ajouter plateformes IA
  - Utiliser slug au lieu de id
  
- ⬜ **3.4.2** Créer version skeleton `TemplateCardSkeleton.tsx`

### 3.5 Page Template Détail
- ⬜ **3.5.1** Créer `app/templates/[slug]/page.tsx`
- ⬜ **3.5.2** Créer `components/template/TemplateHeader.tsx`
  - Titre, byline, prix
  - Badges styles, catégories, tags
  - Tech stack, plateformes
  - Rating, likes
  - Lien créateur
  
- ⬜ **3.5.3** Créer `components/template/TemplatePreview.tsx`
  - Preview conditionnelle selon techStack
  - iframe HTML ou liveDemoUrl
  
- ⬜ **3.5.4** Créer `components/template/TemplateGallery.tsx`
  - Carousel amélioré
  - Thumbnails
  
- ⬜ **3.5.5** Créer `components/template/TemplateActions.tsx`
  - Bouton Buy / Download Free
  - Bouton Like
  
- ⬜ **3.5.6** Créer `components/template/TemplateDetails.tsx`
  - Description longue
  - Liste fichiers inclus
  - Infos techniques
  
- ⬜ **3.5.7** Créer `components/template/CreatorInfo.tsx`
  - Avatar, nom, lien vers page créateur
  
- ⬜ **3.5.8** Créer `components/template/RelatedTemplates.tsx`
  - "More from this creator"
  
- ⬜ **3.5.9** Créer `app/templates/[slug]/loading.tsx`

### 3.6 Migration des Anciennes Routes
- ⬜ **3.6.1** Créer redirections `/product/[id]` → `/templates/[slug]`
- ⬜ **3.6.2** Créer redirections `/products/[category]` → `/templates?category=...`
- ⬜ **3.6.3** Supprimer les anciennes pages après validation

---

## 🔴 Phase 4 : Espace Créateur - Manquants (100%)

### 4.1 Dashboard Créateur
- ⬜ **4.1.1** Créer `app/creator/dashboard/page.tsx`
- ⬜ **4.1.2** Créer `components/creator/StatsCards.tsx`
  - Total ventes
  - Revenus bruts/nets
  - Rating moyen
  - Total favoris
  
- ⬜ **4.1.3** Créer `components/creator/SalesChart.tsx`
  - Graphique ventes 30 jours (Recharts)
  
- ⬜ **4.1.4** Créer `components/creator/TemplatesTable.tsx`
  - DataTable avec colonnes
  - Filtres par statut
  - Actions (edit, view, delete)
  
- ⬜ **4.1.5** Créer `app/creator/dashboard/loading.tsx`

### 4.2 Liste Templates Créateur
- ⬜ **4.2.1** Créer `app/creator/templates/page.tsx`
- ⬜ **4.2.2** Réutiliser `TemplatesTable` avec pagination
- ⬜ **4.2.3** Ajouter filtres et tri
- ⬜ **4.2.4** Créer `app/creator/templates/loading.tsx`

### 4.3 Formulaire Création Template
- ⬜ **4.3.1** Créer `app/creator/templates/new/page.tsx`
- ⬜ **4.3.2** Créer `components/creator/TemplateForm.tsx` (form complet)
- ⬜ **4.3.3** Section Visuels
  - Créer `components/creator/ImageUploader.tsx`
  - Dropzone 2-4 images
  - Preview des images
  - Réorganisation drag & drop
  - Suppression d'image
  
- ⬜ **4.3.4** Section Infos de base
  - Input Name (50 chars)
  - Input Byline (80 chars, optionnel)
  - Textarea Short Description (260 chars)
  
- ⬜ **4.3.5** Section Classification
  - Intégrer StyleSelector
  - Intégrer CategorySelector
  - Intégrer SubcategorySelector
  - Intégrer TagInput
  
- ⬜ **4.3.6** Section Tech & IA
  - Intégrer TechStackSelector
  - Intégrer PlatformSelector
  
- ⬜ **4.3.7** Section Fichiers Conditionnelle
  - Créer `components/creator/FileUploadHTML.tsx`
    - Multi-fichiers (.html, .css, .js, images)
    - Bouton "Set as preview" sur .html
  - Créer `components/creator/FileUploadZip.tsx`
    - Upload .zip unique
    - Input Live Demo URL
  - Logique conditionnelle selon techStack
  
- ⬜ **4.3.8** Section Pricing
  - Toggle Paid/Free
  - Input Price (si Paid)
  
- ⬜ **4.3.9** Section Full Description
  - TipTap enrichi (ajouter listes, liens)
  
- ⬜ **4.3.10** Actions
  - Bouton "Save as Draft"
  - Bouton "Submit for Review"
  
- ⬜ **4.3.11** Créer Server Action `createTemplate`
- ⬜ **4.3.12** Créer validation Zod complète

### 4.4 Édition Template
- ⬜ **4.4.1** Créer `app/creator/templates/[id]/edit/page.tsx`
- ⬜ **4.4.2** Réutiliser `TemplateForm` avec données pré-remplies
- ⬜ **4.4.3** Créer Server Action `updateTemplate`
- ⬜ **4.4.4** Gérer transition PUBLISHED → PENDING si modifié

### 4.5 Suppression Template
- ⬜ **4.5.1** Créer `components/creator/DeleteTemplateDialog.tsx`
- ⬜ **4.5.2** Créer Server Action `deleteTemplate`
- ⬜ **4.5.3** Vérifier pas de ventes existantes

### 4.6 Profil Créateur
- ⬜ **4.6.1** Créer `app/creator/profile/page.tsx`
- ⬜ **4.6.2** Créer `components/creator/ProfileForm.tsx`
  - Username (avec validation unicité)
  - Bio
  - Avatar upload
- ⬜ **4.6.3** Créer Server Action `updateProfile`
- ⬜ **4.6.4** Intégrer lien vers Stripe Connect

### 4.7 Page Créateur Publique
- ⬜ **4.7.1** Créer `app/creator/[username]/page.tsx`
- ⬜ **4.7.2** Créer `components/creator/PublicProfile.tsx`
  - Avatar, nom, bio
  - Stats publiques
- ⬜ **4.7.3** Créer `components/creator/CreatorTemplates.tsx`
  - Grille des templates publiés
  - Filtres simples

---

## 🔴 Phase 5 : Page Explorer & Filtres - Manquants (100%)

### 5.1 Page Explorer
- ⬜ **5.1.1** Créer `app/templates/page.tsx`
- ⬜ **5.1.2** Créer `components/explore/FilterSidebar.tsx`
- ⬜ **5.1.3** Créer `components/explore/FilterChips.tsx` (filtres actifs)
- ⬜ **5.1.4** Créer `components/explore/SortDropdown.tsx`
- ⬜ **5.1.5** Créer `components/explore/ResultsHeader.tsx`
  - Compteur résultats
  - Filtres actifs
  - Bouton clear all
- ⬜ **5.1.6** Créer `components/explore/TemplatesGrid.tsx`
- ⬜ **5.1.7** Créer `components/explore/EmptyState.tsx`
- ⬜ **5.1.8** Créer `app/templates/loading.tsx`

### 5.2 Système de Filtres
- ⬜ **5.2.1** Créer hook `useTemplateFilters`
  - Gestion état filtres
  - Sync avec URL query params
- ⬜ **5.2.2** Implémenter filtre Styles (multi-select)
- ⬜ **5.2.3** Implémenter filtre Categories (multi-select)
- ⬜ **5.2.4** Implémenter filtre Subcategories (filtré)
- ⬜ **5.2.5** Implémenter filtre Tags (search + select)
- ⬜ **5.2.6** Implémenter filtre Tech Stack (radio)
- ⬜ **5.2.7** Implémenter filtre Platforms (multi-select)
- ⬜ **5.2.8** Implémenter filtre Prix (Free/Paid/Range)

### 5.3 Système de Tri
- ⬜ **5.3.1** Implémenter tri par date (récent)
- ⬜ **5.3.2** Implémenter tri par popularité (score)
- ⬜ **5.3.3** Implémenter tri par prix
- ⬜ **5.3.4** Implémenter tri par rating
- ⬜ **5.3.5** Implémenter tri par likes

### 5.4 Pagination
- ⬜ **5.4.1** Créer `components/ui/pagination.tsx` (si pas Shadcn)
- ⬜ **5.4.2** Implémenter pagination côté serveur
- ⬜ **5.4.3** Sync pagination avec URL

### 5.5 API Route Templates
- ⬜ **5.5.1** Créer `app/api/templates/route.ts` (GET avec filtres)
- ⬜ **5.5.2** Implémenter query Prisma avec tous les filtres
- ⬜ **5.5.3** Implémenter le tri
- ⬜ **5.5.4** Implémenter la pagination
- ⬜ **5.5.5** Ajouter cache headers

---

## 🔴 Phase 6 : Système IA - Manquants (90%)

### 6.1 Setup Infrastructure IA
- ✅ **6.1.1** Configurer client OpenAI (fait dans `app/lib/openai.ts`)
- ⬜ **6.1.2** Décider du vector store
  - Option A : Supabase pgvector (recommandé si déjà Supabase)
  - Option B : Pinecone
- ⬜ **6.1.3** Setup vector store
- ⬜ **6.1.4** Créer table/index pour embeddings

### 6.2 Génération des Embeddings
- ⬜ **6.2.1** Créer fonction `generateTemplateEmbedding(template)`
  - Concaténer: title, shortDesc, styles, categories, tags, techStack, platforms
  - Générer embedding avec OpenAI
- ⬜ **6.2.2** Créer fonction `storeEmbedding(templateId, embedding)`
- ⬜ **6.2.3** Créer script de batch pour templates existants
- ⬜ **6.2.4** Exécuter le batch initial

### 6.3 Indexation Automatique
- ⬜ **6.3.1** Hook dans `createTemplate` → générer embedding
- ⬜ **6.3.2** Hook dans `updateTemplate` → re-générer embedding
- ⬜ **6.3.3** Hook dans `deleteTemplate` → supprimer embedding

### 6.4 Endpoint Suggest Templates
- ⬜ **6.4.1** Créer `app/api/ai/suggest-templates/route.ts`
- ⬜ **6.4.2** Implémenter parsing de la query
- ⬜ **6.4.3** Implémenter génération embedding de la query
- ⬜ **6.4.4** Implémenter recherche par similarité
- ⬜ **6.4.5** Implémenter filtrage (status = PUBLISHED)
- ⬜ **6.4.6** Implémenter reranking (rating, likes, ventes)
- ⬜ **6.4.7** Implémenter génération d'explications
- ⬜ **6.4.8** Limiter à 6 résultats max
- ⬜ **6.4.9** Ajouter gestion d'erreurs et fallback

### 6.5 Intégration Frontend
- ⬜ **6.5.1** Connecter `AISearchBox` à l'API
- ⬜ **6.5.2** Afficher résultats dans `AIResultsGrid`
- ⬜ **6.5.3** Gérer états loading/error/empty
- ⬜ **6.5.4** Ajouter animations de transition

---

## 🔴 Phase 7 : Espace Admin - Manquants (100%)

### 7.1 Dashboard Admin
- ⬜ **7.1.1** Créer `app/admin/page.tsx`
- ⬜ **7.1.2** Créer `components/admin/GlobalStats.tsx`
  - Templates par statut
  - Total ventes
  - Revenus plateforme
  - Nb utilisateurs/créateurs
- ⬜ **7.1.3** Créer `components/admin/PendingTemplates.tsx`
  - Liste des templates en attente
  - Actions rapides
- ⬜ **7.1.4** Créer `components/admin/RecentActivity.tsx`
- ⬜ **7.1.5** Créer `app/admin/loading.tsx`

### 7.2 Gestion Templates Admin
- ⬜ **7.2.1** Créer `app/admin/templates/page.tsx`
- ⬜ **7.2.2** Créer `components/admin/AdminTemplatesTable.tsx`
  - Toutes colonnes
  - Filtres avancés
  - Actions batch
- ⬜ **7.2.3** Créer `app/admin/templates/[id]/page.tsx`
- ⬜ **7.2.4** Créer `components/admin/TemplateReview.tsx`
  - Toutes métadonnées
  - Preview
  - Historique
- ⬜ **7.2.5** Créer `components/admin/ApproveRejectActions.tsx`
- ⬜ **7.2.6** Créer Server Action `approveTemplate`
- ⬜ **7.2.7** Créer Server Action `rejectTemplate` (avec message)

### 7.3 Gestion Reviews Admin
- ⬜ **7.3.1** Créer `app/admin/reviews/page.tsx`
- ⬜ **7.3.2** Créer `components/admin/ReviewsTable.tsx`
- ⬜ **7.3.3** Créer Server Action `deleteReview`

### 7.4 API Routes Admin
- ⬜ **7.4.1** Créer `app/api/admin/stats/route.ts`
- ⬜ **7.4.2** Créer `app/api/admin/templates/[id]/approve/route.ts`
- ⬜ **7.4.3** Créer `app/api/admin/templates/[id]/reject/route.ts`

---

## 🔴 Phase 8 : Paiement & Download - Manquants (100%)

### 8.1 Refonte Achat
- ⬜ **8.1.1** Mettre à jour `BuyProduct` → `BuyTemplate`
- ⬜ **8.1.2** Créer `Order` après paiement réussi
- ⬜ **8.1.3** Gérer templates gratuits (bypass Stripe)
- ⬜ **8.1.4** Créer Server Action `claimFreeTemplate`

### 8.2 Webhook Stripe Amélioré
- ✅ **8.2.1** Corriger l'email destinataire (fait)
- ⬜ **8.2.2** Créer `Order` dans le webhook
- ⬜ **8.2.3** Mettre à jour `downloadAvailable = true`
- ⬜ **8.2.4** Améliorer gestion d'erreurs

### 8.3 Page Download Sécurisée
- ⬜ **8.3.1** Créer `app/download/[orderId]/page.tsx`
- ⬜ **8.3.2** Vérifier `order.buyerId === currentUser.id`
- ⬜ **8.3.3** Vérifier `order.downloadAvailable === true`
- ⬜ **8.3.4** Créer `components/download/FileList.tsx`
- ⬜ **8.3.5** Créer `components/download/DownloadButton.tsx`
- ⬜ **8.3.6** Incrémenter `downloadCount` à chaque download
- ⬜ **8.3.7** Créer `app/download/[orderId]/loading.tsx`

### 8.4 Historique Achats
- ⬜ **8.4.1** Créer `app/user/purchases/page.tsx`
- ⬜ **8.4.2** Créer `components/user/PurchasesList.tsx`
- ⬜ **8.4.3** Lien vers download pour chaque achat

### 8.5 Pages Success/Cancel
- ⬜ **8.5.1** Renommer `/payment/success` → `/purchase/success`
- ⬜ **8.5.2** Renommer `/payment/cancel` → `/purchase/cancel`
- ⬜ **8.5.3** Améliorer contenu des pages
- ⬜ **8.5.4** Ajouter lien vers download dans success

---

## 🔴 Phase 9 : Reviews & Favoris - Manquants (100%)

### 9.1 Système Favoris
- ⬜ **9.1.1** Créer `app/api/favorites/route.ts` (GET, POST)
- ⬜ **9.1.2** Créer `app/api/favorites/[templateId]/route.ts` (DELETE, GET)
- ⬜ **9.1.3** Créer `components/ui/LikeButton.tsx`
  - Toggle like/unlike
  - Optimistic update
  - Animation cœur
- ⬜ **9.1.4** Intégrer LikeButton dans TemplateCard
- ⬜ **9.1.5** Intégrer LikeButton dans page template
- ⬜ **9.1.6** Créer `app/user/favorites/page.tsx`
- ⬜ **9.1.7** Créer `components/user/FavoritesList.tsx`

### 9.2 Système Reviews
- ⬜ **9.2.1** Créer `app/api/reviews/route.ts` (GET, POST)
- ⬜ **9.2.2** Créer `app/api/reviews/[id]/route.ts` (PUT, DELETE)
- ⬜ **9.2.3** Créer `components/reviews/ReviewSummary.tsx`
  - Moyenne
  - Distribution (barres)
  - Nombre total
- ⬜ **9.2.4** Créer `components/reviews/ReviewCard.tsx`
- ⬜ **9.2.5** Créer `components/reviews/ReviewsList.tsx`
  - Pagination/lazy load
- ⬜ **9.2.6** Créer `components/reviews/ReviewForm.tsx`
  - Rating input (étoiles)
  - Textarea commentaire
- ⬜ **9.2.7** Créer `components/ui/RatingStars.tsx`
- ⬜ **9.2.8** Créer `components/ui/RatingInput.tsx`
- ⬜ **9.2.9** Intégrer dans page template
- ⬜ **9.2.10** Vérifier restriction acheteurs
- ⬜ **9.2.11** Gérer édition de review existante

### 9.3 Mise à Jour des Stats
- ⬜ **9.3.1** Recalculer `ratingAverage` et `ratingCount` après review
- ⬜ **9.3.2** Recalculer `likeCount` après like/unlike
- ⬜ **9.3.3** Créer jobs de recalcul (optionnel)

---

## 🔴 Phase 10 : SEO, Branding & Polish - Manquants (100%)

### 10.1 Metadata & SEO
- ⬜ **10.1.1** Mettre à jour metadata dans `app/layout.tsx`
- ⬜ **10.1.2** Créer metadata dynamiques pour `/templates/[slug]`
- ⬜ **10.1.3** Créer metadata dynamiques pour `/creator/[username]`
- ⬜ **10.1.4** Créer `app/sitemap.ts`
- ⬜ **10.1.5** Créer `app/robots.ts`
- ⬜ **10.1.6** Créer image Open Graph par défaut

### 10.2 Branding
- ⬜ **10.2.1** Définir nouveau nom de marque
- ⬜ **10.2.2** Créer/mettre à jour logo
- ⬜ **10.2.3** Créer nouveau favicon
- ⬜ **10.2.4** Mettre à jour couleur primaire
- ⬜ **10.2.5** Mettre à jour tous les textes "MarshalUI"

### 10.3 Composants Globaux
- ⬜ **10.3.1** Créer `components/layout/Footer.tsx`
- ⬜ **10.3.2** Créer `components/layout/Breadcrumbs.tsx`
- ⬜ **10.3.3** Intégrer Footer dans layout
- ⬜ **10.3.4** Créer `app/not-found.tsx` (404)
- ⬜ **10.3.5** Créer `app/error.tsx` (500)

### 10.4 Dark Mode
- ⬜ **10.4.1** Créer `components/ThemeToggle.tsx`
- ⬜ **10.4.2** Ajouter ThemeProvider dans layout
- ⬜ **10.4.3** Intégrer toggle dans navbar

### 10.5 Navigation
- ⬜ **10.5.1** Mettre à jour `NavbarLinks` avec nouvelles catégories
- ⬜ **10.5.2** Ajouter liens vers espace créateur si rôle CREATOR
- ⬜ **10.5.3** Ajouter lien vers admin si rôle ADMIN
- ⬜ **10.5.4** Mettre à jour `UserNav` avec nouveaux liens
- ⬜ **10.5.5** Mettre à jour `MobileMenu`

### 10.6 Pages Légales
- ⬜ **10.6.1** Créer `app/legal/terms/page.tsx`
- ⬜ **10.6.2** Créer `app/legal/privacy/page.tsx`
- ⬜ **10.6.3** Ajouter liens dans footer

### 10.7 Emails
- ⬜ **10.7.1** Mettre à jour `ProductEmail` → `PurchaseEmail`
- ⬜ **10.7.2** Créer `TemplateApprovedEmail.tsx`
- ⬜ **10.7.3** Créer `TemplateRejectedEmail.tsx`
- ⬜ **10.7.4** Créer `NewSaleEmail.tsx`

---

## 🔴 Phase 11 : Tests & Déploiement - Manquants (100%)

### 11.1 Tests Manuels
- ⬜ **11.1.1** Tester flow complet acheteur
- ⬜ **11.1.2** Tester flow complet créateur
- ⬜ **11.1.3** Tester flow admin
- ⬜ **11.1.4** Tester responsive (mobile, tablet, desktop)
- ⬜ **11.1.5** Tester dark mode
- ⬜ **11.1.6** Tester accessibilité basique

### 11.2 Performance
- ⬜ **11.2.1** Vérifier les indexes Prisma
- ⬜ **11.2.2** Analyser bundle size
- ⬜ **11.2.3** Tester temps de chargement
- ⬜ **11.2.4** Optimiser images

### 11.3 Sécurité
- ⬜ **11.3.1** Vérifier toutes les protections de routes
- ⬜ **11.3.2** Vérifier ownership des ressources
- ⬜ **11.3.3** Tester les validations

### 11.4 Préparation Prod
- ⬜ **11.4.1** Mettre à jour variables d'environnement prod
- ⬜ **11.4.2** Configurer webhooks Stripe prod
- ⬜ **11.4.3** Vérifier domaines autorisés (images, auth)
- ⬜ **11.4.4** Configurer domaine email Resend

### 11.5 Migration Production
- ⬜ **11.5.1** Backup base de données prod
- ⬜ **11.5.2** Exécuter migrations Prisma
- ⬜ **11.5.3** Exécuter seeds
- ⬜ **11.5.4** Migrer données Product → Template
- ⬜ **11.5.5** Générer embeddings pour templates existants
- ⬜ **11.5.6** Déployer sur Vercel
- ⬜ **11.5.7** Vérifier webhooks Stripe
- ⬜ **11.5.8** Tests de fumée en prod

### 11.6 Post-Déploiement
- ⬜ **11.6.1** Monitorer erreurs (Vercel logs)
- ⬜ **11.6.2** Vérifier emails envoyés
- ⬜ **11.6.3** Vérifier paiements
- ⬜ **11.6.4** Communiquer le lancement

---

## 📊 Résumé par Priorité

### P0 - Critique (MVP) - ~190 tâches manquantes
- Phase 1: Migration BDD (10%)
- Phase 2: Classification (50%)
- Phase 3: Routes & Pages (95%)
- Phase 4: Espace Créateur (100%)
- Phase 5: Explorer & Filtres (100%)
- Phase 6: Système IA (90%)
- Phase 7: Espace Admin (100%)
- Phase 8: Paiement & Download (100%)
- Phase 11: Tests & Déploiement (100%)

### P1 - Important - ~35 tâches manquantes
- Phase 9: Reviews & Favoris (100%)
- Phase 10: SEO & Polish (100%)

---

## 🎯 Priorités d'Implémentation

### Immédiat (Semaine 1)
1. ✅ Migration BDD (exécuter migration et seed)
2. ⬜ Composants de classification manquants
3. ⬜ Middleware et protection des routes
4. ⬜ Page d'accueil refonte

### Court terme (Semaines 2-3)
5. ⬜ Page explorer avec filtres
6. ⬜ Page template détail
7. ⬜ Espace créateur (dashboard, formulaire)

### Moyen terme (Semaines 4-5)
8. ⬜ Système IA (embeddings, recherche)
9. ⬜ Espace admin
10. ⬜ Paiement & Download amélioré

### Long terme (Semaines 6+)
11. ⬜ Reviews & Favoris
12. ⬜ SEO & Polish
13. ⬜ Tests & Déploiement

---

*Document créé le: 2024-12-03*  
*Basé sur TASKS.md et MISSING_FEATURES.md*
