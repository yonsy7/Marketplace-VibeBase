# Fonctionnalités Manquantes - VibeBase Marketplace V1

## Document de comparaison : Code actuel vs PRD

Ce document liste toutes les fonctionnalités manquantes entre l'implémentation actuelle et les spécifications du PRD V1.

---

## 📊 Vue d'ensemble

**État actuel** : Marketplace générique pour templates Tailwind CSS, UI kits et icônes  
**Cible PRD** : Marketplace spécialisée pour templates AI-ready (HTML/React/Next.js) avec système de classification avancé, recherche IA, reviews, favoris, et gestion complète créateurs/admins.

---

## 🗄️ 1. Modèle de données (Database Schema)

### 1.1 Modèles manquants dans Prisma

#### ❌ Template Model (remplace Product)
- `slug` (String, unique) - URL-friendly identifier
- `title` (String) - Nom du template
- `byline` (String, optional) - Sous-titre optionnel
- `shortDesc` (String) - Description courte (max 260)
- `longDesc` (String, optional) - Description complète (rich text)
- `status` (TemplateStatus enum) - DRAFT, PENDING, PUBLISHED, REJECTED
- `techStack` (TechStack enum) - HTML, REACT_VITE, NEXTJS
- `previewFileId` (String, optional) - Fichier HTML de preview
- `previewImages` (Json, optional) - Array d'images de preview
- `liveDemoUrl` (String, optional) - URL pour démo live (Vite/Next.js)
- `ratingAverage` (Float, default 0)
- `ratingCount` (Int, default 0)
- `likeCount` (Int, default 0)
- Relations avec StyleTag, Category, Subcategory, Tag, Platform

#### ❌ TemplateFile Model
- `id` (String)
- `templateId` (String)
- `fileUrl` (String)
- `fileType` (FileType enum) - HTML, PROJECT_ZIP, CSS, JS, ASSET
- `fileName` (String)

#### ❌ StyleTag Model
- `id` (String)
- `name` (String, unique) - clean-minimal, dark-saas, pastel-playful, etc.

#### ❌ TemplateStyleTag Model (relation many-to-many)
- `templateId` (String)
- `styleTagId` (String)
- Composite primary key

#### ❌ Category Model
- `id` (String)
- `name` (String, unique) - Marketing & Landing, Product & App UI, Dashboard & Analytics
- Relation avec Subcategory[]

#### ❌ Subcategory Model
- `id` (String)
- `name` (String)
- `categoryId` (String)
- Unique constraint sur [categoryId, name]

#### ❌ TemplateCategory Model (relation many-to-many)
- `templateId` (String)
- `categoryId` (String)

#### ❌ TemplateSubcategory Model (relation many-to-many)
- `templateId` (String)
- `subcategoryId` (String)

#### ❌ Tag Model
- `id` (String)
- `name` (String, unique)

#### ❌ TemplateTag Model (relation many-to-many)
- `templateId` (String)
- `tagId` (String)

#### ❌ TemplatePlatform Model
- `id` (String)
- `templateId` (String)
- `platform` (PlatformType enum) - V0, LOVABLE, SUBFRAME, etc.

#### ❌ Order Model
- `id` (String)
- `buyerId` (String)
- `templateId` (String)
- `paymentIntentId` (String)
- `downloadAvailable` (Boolean, default false)
- `createdAt` (DateTime)

#### ❌ Review Model
- `id` (String)
- `templateId` (String)
- `userId` (String)
- `rating` (Int, 1-5)
- `comment` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Unique constraint sur [templateId, userId]

#### ❌ Favorite Model
- `id` (String)
- `templateId` (String)
- `userId` (String)
- `createdAt` (DateTime)
- Unique constraint sur [templateId, userId]

### 1.2 Enums manquants

#### ❌ TemplateStatus
```prisma
enum TemplateStatus {
  DRAFT
  PENDING
  PUBLISHED
  REJECTED
}
```

#### ❌ TechStack
```prisma
enum TechStack {
  HTML
  REACT_VITE
  NEXTJS
}
```

#### ❌ FileType
```prisma
enum FileType {
  HTML
  PROJECT_ZIP
  CSS
  JS
  ASSET
}
```

#### ❌ PlatformType
```prisma
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
```

#### ❌ UserRole
```prisma
enum UserRole {
  USER
  CREATOR
  ADMIN
}
```

### 1.3 Modifications User Model

#### ⚠️ Champs manquants dans User
- `username` (String, unique) - Pour URLs publiques créateur
- `bio` (String, optional) - Bio du créateur
- `avatarUrl` (String, optional) - Avatar (actuellement `profileImage`)
- `role` (UserRole enum, default USER) - USER, CREATOR, ADMIN

---

## 🏠 2. Page d'accueil (Home)

### 2.1 Bloc 1 - AI Template Finder (Hero) ❌

**Manquant complètement** :
- Textarea full-width pour recherche IA
- Placeholder : "Décris ton besoin : 'Landing SaaS dark en Next.js'..."
- Bouton "Trouver mes templates"
- POST vers `/api/ai/suggest-templates`
- Affichage de résultats recommandés (3-6 templates)
- Cartes de résultats avec :
  - Image principale
  - Nom
  - Style principal
  - Catégories principales
  - Stack (HTML/Vite/Next.js)
  - Plateformes IA (icônes)
  - Prix
  - Note moyenne
  - Nombre de likes
- États : loading (skeletons), erreur, aucun résultat

### 2.2 Bloc 2 - Styles populaires ❌

**Manquant** :
- Section "Popular styles"
- Chips cliquables pour chaque style
- Clic → filtre `/templates?style=clean-minimal`

### 2.3 Bloc 3 - Catégories ❌

**Manquant** :
- 3 grandes cartes de catégories :
  - Marketing & Landing
  - Product & App UI
  - Dashboard & Analytics
- Chaque carte avec icône, description, CTA "Browse"
- Clic → `/templates?category=...`

### 2.4 Bloc 4 - Plateformes IA ❌

**Manquant** :
- Bande d'icônes : v0.dev, Lovable, Subframe, Magic Patterns, Uizard, Onlook, etc.
- Clic → `/templates?platform=V0`

### 2.5 Bloc 5 - Templates populaires ⚠️

**Partiellement implémenté** :
- Actuellement : `ProductRow` avec catégories génériques
- **Manque** : Algorithme de popularité (ventes + likes + vues + rating)
- **Manque** : Affichage des métadonnées (styles, plateformes IA, stack)

### 2.6 Bloc 6 - Nouveaux templates ⚠️

**Partiellement implémenté** :
- Actuellement : `ProductRow category="newest"`
- **Manque** : Affichage des métadonnées (styles, plateformes IA, stack)

### 2.7 Bloc 7 - Créateurs mis en avant ❌

**Manquant complètement** :
- Section avec 2-4 profils créateurs
- Stats simplifiées (nb templates, rating moyen)
- Clic → page créateur publique

---

## 🔍 3. Explorer /templates

### 3.1 Route /templates ❌

**Manquant complètement** :
- Page catalogue avec filtres avancés
- Bar de filtres horizontale + panneaux :
  - Styles (multi-select)
  - Catégories (multi-select)
  - Sous-catégories (filtrées par catégories sélectionnées)
  - Tags
  - Tech Stack : HTML / React Vite / Next.js
  - IA Platforms
  - Prix (free / paid / range)
- Tri :
  - Récent
  - Populaire
  - Prix croissant
  - Meilleure note
  - Plus likés
- Grille de cartes templates
- Pagination ou infinite scroll

### 3.2 Route /templates/[slug] ❌

**Manquant complètement** (actuellement `/product/[id]` existe mais ne correspond pas) :
- Header avec :
  - Nom
  - Byline (optionnel)
  - Prix (ou badge "Free")
  - Styles (liste de badges)
  - Catégories & sous-catégories
  - Tags
  - Tech stack
  - Plateformes IA
  - Moyenne de rating + nb reviews
  - Nombre de likes
  - Créateur (avatar + nom) → lien `/creator/[username]`
- Preview :
  - Si HTML : iframe sandbox (URL fichier HTML de preview)
  - Si REACT_VITE ou NEXTJS : iframe sur liveDemoUrl + bouton "Open live demo"
- Contenu :
  - Carousel de screenshots (4 images max)
  - Short description
  - Full description (format rich text)
  - Liste des fichiers inclus
- Likes / Favoris :
  - Bouton toggle "❤️ Add to favorites" / "💔 Remove from favorites"
  - Compteur : XXX favorites
- Reviews & Ratings :
  - Sommaire : moyenne ★ 1-5, nb de reviews
  - Liste reviews avec pagination/lazy load
  - Ajouter / éditer une review (uniquement si user a une Order sur ce Template)
  - Champs : rating (1-5), commentaire (optionnel)
- CTAs & cross-selling :
  - Bouton principal : "Buy template"
  - Section "More from this creator"
  - (Optionnel V1) section "Similar templates"

---

## 💳 4. Paiement & téléchargement

### 4.1 Route /download/[orderId] ❌

**Manquant complètement** :
- Access control : vérifie que `order.buyerId = currentUser.id`
- Liste de liens de téléchargement :
  - HTML files
  - ZIP projet Vite / Next.js
  - Assets

### 4.2 Modifications checkout ⚠️

**Partiellement implémenté** :
- Actuellement : Stripe Checkout fonctionne
- **Manque** : Création d'Order dans la DB après paiement
- **Manque** : Gestion des TemplateFile pour téléchargement
- **Manque** : Redirection vers `/download/[orderId]` après succès

---

## ⭐ 5. Favoris

### 5.1 Route /user/favorites ❌

**Manquant complètement** :
- Liste de tous les templates likés
- Cartes pointent vers `/templates/[slug]`
- Possibilité de retirer/unlike depuis la liste

### 5.2 Fonctionnalité Like/Favorite ❌

**Manquant** :
- Server action pour ajouter/retirer un favorite
- API endpoint pour toggle favorite
- Compteur de likes sur chaque template
- Mise à jour en temps réel

---

## 👨‍🎨 6. Fonctionnalités créateurs

### 6.1 Dashboard /creator/dashboard ❌

**Manquant complètement** :
- Section stats :
  - Total ventes
  - Revenus cumulés (gross + share créateur)
  - Rating moyen
  - Total favoris
- Tableau de templates :
  - Titre
  - Statut (Draft / Pending / Published / Rejected)
  - Vues
  - Ventes
  - Rating
  - Likes
  - Actions : éditer, voir

### 6.2 Liste templates /creator/templates ❌

**Manquant complètement** :
- Vue liste simplifiée
- Tri par statut / date

### 6.3 Formulaire "New Template" /creator/templates/new ❌

**Manquant complètement** (actuellement `/sell` existe mais ne correspond pas) :

#### Section Visuels ❌
- Dropzone images : 0/4
- Min : 2 images
- Max : 4 images

#### Section Infos de base ⚠️
- Name (obligatoire, ~50 caractères) - ✅ Existe
- Byline (optionnelle, ~80 caractères) - ❌ Manque
- Short Description (obligatoire, max 260) - ⚠️ Existe mais pas de limite

#### Section Classification ❌
- Categories (multi-select, 0/3) - ⚠️ Existe mais simple select
- Styles (multi-select, 0/5) - ❌ Manque
- Subcategories (multi-select, 0/6) - ❌ Manque
- Tags (input tags avec chips) - ❌ Manque

#### Section Tech & IA ❌
- Tech Stack (radio ou select) : HTML, React (Vite), Next.js - ❌ Manque
- Compatible AI Platforms (multi-select) - ❌ Manque

#### Section Fichiers ⚠️
- Si HTML :
  - Dropzone multi-fichiers (.html, .css, .js, images) - ❌ Manque
  - Liste des fichiers uploadés - ❌ Manque
  - Sur chaque fichier HTML : bouton "Set as preview" - ❌ Manque
  - Obligation d'avoir au moins un fichier HTML et un previewFile - ❌ Manque
- Si React Vite ou Next.js :
  - Dropzone pour un fichier .zip - ✅ Existe (productFileUpload)
  - Champ Live demo URL (obligatoire) - ❌ Manque
  - Validation : .zip présent, URL valide - ❌ Manque

#### Section Pricing ⚠️
- Toggle : Paid - ❌ Manque
- OFF → template gratuit (prix = 0) - ❌ Manque
- ON → champ Price - ✅ Existe

#### Section Full Description ✅
- Rich text editor - ✅ Existe (TipTap)

#### Actions ⚠️
- Bouton "Save as Draft" - ❌ Manque
- Bouton "Publish" (soumission à modération, statut → PENDING) - ❌ Manque

### 6.4 Edition /creator/templates/[id]/edit ❌

**Manquant complètement** :
- Même structure que `/creator/templates/new`
- Chargement des champs existants
- Mêmes validations
- Si template PUBLISHED modifié → repasser en PENDING (recommandé V1)

### 6.5 Profil créateur /creator/profile ❌

**Manquant complètement** :
- Gérer :
  - Nom public / username
  - Bio courte
  - Avatar image
- Intégration Stripe Connect (lien vers le flow Stripe) - ⚠️ Existe dans `/billing` mais pas dans profil créateur

### 6.6 Page publique créateur /creator/[username] ❌

**Manquant complètement** :
- Avatar, nom, bio
- Styles & catégories dominants (statistiques)
- Stats :
  - Rating moyen global
  - Total likes sur tous ses templates
- Liste des templates publiés
- Filtres par style, catégorie, stack, plateforme IA

---

## 👨‍💼 7. Fonctions admin

### 7.1 Dashboard /admin ❌

**Manquant complètement** :
- Vue globale :
  - Nb templates (DRAFT/PENDING/PUBLISHED/REJECTED)
  - Nb ventes
  - Top templates
  - Liste des templates en PENDING

### 7.2 Gestion templates /admin/templates & /admin/templates/[id] ❌

**Manquant complètement** :
- Voir toutes les métadonnées :
  - Styles, catégories, sous-catégories, tags
  - Stack, IA platforms
  - Fichiers, preview
- Actions :
  - Approve (→ PUBLISHED)
  - Reject (→ REJECTED, avec option d'ajouter un message)

### 7.3 Gestion reviews /admin/reviews & /admin/reviews/[id] ❌

**Manquant complètement** :
- Liste de toutes les reviews
- Tri / filtre par template, score, date
- Action : supprimer une review abusive

---

## 🤖 8. IA - Endpoint & logique

### 8.1 Endpoint /api/ai/suggest-templates ❌

**Manquant complètement** :
- POST endpoint
- Input : `{ "query": "Landing Next.js pour un SaaS B2B, style dark minimal" }`
- Output :
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
        "score": 0.93,
        "explanation": "Matches your request..."
      }
    ]
  }
  ```

### 8.2 Logique IA ❌

**Manquant** :
- Embeddings sur :
  - Titre, descriptions, styles, catégories, sous-catégories, tags
- Similarité vectorielle avec query
- Reranking en pondérant :
  - Rating moyen
  - Likes
  - Ventes (si dispo)
- Retour maximum 6 templates

**Note** : Pour V1, peut utiliser une approche simplifiée (recherche textuelle + scoring) avant d'implémenter les embeddings.

---

## 🔄 9. Modifications routes existantes

### 9.1 Routes à supprimer/remplacer

- `/product/[id]` → Remplacer par `/templates/[slug]`
- `/products/[category]` → Remplacer par `/templates` avec filtres
- `/sell` → Remplacer par `/creator/templates/new`
- `/my-products` → Remplacer par `/creator/templates` ou `/creator/dashboard`

### 9.2 Routes à modifier

- `/payment/success` → Ajouter création d'Order + redirection vers `/download/[orderId]`
- `/billing` → Intégrer dans `/creator/profile` ou garder séparé

---

## 📦 10. Système de fichiers

### 10.1 UploadThing - Nouveaux endpoints ❌

**Manquants** :
- `templateFileUpload` : Multi-fichiers pour templates HTML
  - Types : .html, .css, .js, images
  - Max files : variable (selon template)
- `templateImageUpload` : Images de preview (2-4 images)
  - Max : 4 images
  - Min : 2 images

### 10.2 Gestion fichiers templates ❌

**Manquant** :
- Stockage des fichiers par template
- Association fichier → template
- Gestion previewFile pour HTML
- Liste des fichiers inclus dans un template

---

## 🎨 11. UI Components manquants

### 11.1 Composants de classification ❌

- `StyleSelector` : Multi-select pour styles
- `CategorySelector` : Multi-select pour catégories
- `SubcategorySelector` : Multi-select filtré par catégories
- `TagInput` : Input avec chips pour tags
- `PlatformSelector` : Multi-select pour plateformes IA
- `TechStackSelector` : Radio/select pour tech stack

### 11.2 Composants template ❌

- `TemplateCard` : Carte avec toutes les métadonnées (styles, plateformes, stack)
- `TemplatePreview` : Iframe sandbox pour HTML ou live demo
- `ReviewSection` : Section reviews avec formulaire
- `FavoriteButton` : Bouton toggle like/favorite
- `TemplateStats` : Affichage stats (rating, likes, ventes)

### 11.3 Composants créateur ❌

- `CreatorDashboard` : Dashboard avec stats
- `TemplateStatusBadge` : Badge pour statut (Draft/Pending/Published/Rejected)
- `TemplateManagementTable` : Tableau de gestion templates

### 11.4 Composants admin ❌

- `AdminDashboard` : Dashboard admin
- `TemplateModeration` : Interface de modération
- `ReviewManagement` : Gestion reviews

### 11.5 Composants filtres ❌

- `FilterBar` : Barre de filtres horizontale
- `FilterPanel` : Panneaux de filtres (styles, catégories, etc.)
- `SortSelector` : Sélecteur de tri

---

## 🔐 12. Authentification & autorisation

### 12.1 Rôles utilisateurs ❌

**Manquant** :
- Système de rôles (USER, CREATOR, ADMIN)
- Middleware pour protéger routes admin
- Middleware pour protéger routes créateur
- Vérification de rôle dans server actions

### 12.2 Permissions ❌

**Manquant** :
- Seuls les créateurs peuvent créer des templates
- Seuls les admins peuvent approuver/rejeter
- Seuls les acheteurs (avec Order) peuvent laisser une review
- Seuls les propriétaires peuvent éditer leurs templates

---

## 📊 13. Analytics & Stats

### 13.1 Compteurs manquants ❌

**Manquant** :
- Compteur de vues par template
- Compteur de ventes par template
- Rating moyen calculé automatiquement
- Like count mis à jour en temps réel

### 13.2 Stats créateur ❌

**Manquant** :
- Total ventes
- Revenus cumulés
- Rating moyen global
- Total favoris sur tous templates

---

## 🧪 14. Validations & règles métier

### 14.1 Validations template ❌

**Manquant** :
- Slug unique et URL-friendly
- Min 2 images, max 4 images
- Short description max 260 caractères
- Au moins 1 catégorie, max 3
- Au moins 1 style, max 5
- Max 6 sous-catégories
- Si HTML : au moins 1 fichier HTML + previewFile sélectionné
- Si Vite/Next.js : .zip présent + liveDemoUrl valide
- Si Paid : prix > 0, sinon prix = 0

### 14.2 Workflow modération ❌

**Manquant** :
- Template créé → statut DRAFT
- Bouton "Publish" → statut PENDING
- Admin approuve → statut PUBLISHED
- Admin rejette → statut REJECTED (avec message optionnel)
- Template PUBLISHED modifié → retourne en PENDING

### 14.3 Validations review ❌

**Manquant** :
- Un utilisateur ne peut laisser qu'une review par template
- Review uniquement si Order existe pour ce template
- Rating entre 1 et 5
- Commentaire optionnel

---

## 🔄 15. Migrations & données de base

### 15.1 Seed data ❌

**Manquant** :
- Styles de base (clean-minimal, dark-saas, etc.)
- Catégories de base (Marketing & Landing, Product & App UI, Dashboard & Analytics)
- Sous-catégories pour chaque catégorie
- Plateformes IA (V0, Lovable, etc.)

### 15.2 Migration Product → Template ❌

**Manquant** :
- Script de migration pour convertir Product existants en Template
- Mapping des données existantes
- Génération de slugs
- Attribution de catégories/styles par défaut

---

## 📝 16. Documentation & tests

### 16.1 Documentation API ❌

**Manquant** :
- Documentation des endpoints API
- Exemples de requêtes/réponses
- Documentation des server actions

### 16.2 Tests ❌

**Manquant** :
- Tests unitaires pour server actions
- Tests d'intégration pour workflows
- Tests E2E pour parcours utilisateur

---

## 🎯 17. Priorisation recommandée

### Phase 1 - Fondations (Critique)
1. ✅ Modèle de données complet (Prisma schema)
2. ✅ Migrations et seed data
3. ✅ Système de rôles et permissions
4. ✅ Routes de base : `/templates`, `/templates/[slug]`

### Phase 2 - Créateurs (Haute priorité)
5. ✅ Formulaire création template complet
6. ✅ Dashboard créateur
7. ✅ Gestion templates (liste, édition)
8. ✅ Page publique créateur

### Phase 3 - Acheteurs (Haute priorité)
9. ✅ Page d'accueil avec blocs PRD
10. ✅ Filtres et recherche avancée
11. ✅ Reviews & Ratings
12. ✅ Favoris

### Phase 4 - Admin (Moyenne priorité)
13. ✅ Dashboard admin
14. ✅ Modération templates
15. ✅ Gestion reviews

### Phase 5 - IA (Moyenne priorité)
16. ✅ Endpoint recherche IA (version simplifiée V1)
17. ✅ Amélioration avec embeddings (post-V1)

### Phase 6 - Polish (Basse priorité)
18. ✅ Analytics avancées
19. ✅ Optimisations performance
20. ✅ Tests complets

---

## 📌 Notes importantes

1. **Slug vs ID** : Le PRD utilise des slugs pour les URLs (`/templates/[slug]`), alors que le code actuel utilise des IDs (`/product/[id]`). Migration nécessaire.

2. **TemplateStatus** : Système de workflow DRAFT → PENDING → PUBLISHED/REJECTED complètement absent.

3. **Classification multi-niveaux** : Le système actuel a seulement des catégories simples. Le PRD nécessite Styles + Catégories + Sous-catégories + Tags.

4. **Tech Stack** : Distinction HTML vs React Vite vs Next.js avec comportements différents (preview, fichiers) absente.

5. **Plateformes IA** : Concept complètement nouveau, non présent dans le code actuel.

6. **Reviews & Favoris** : Fonctionnalités sociales complètement absentes.

7. **Admin Panel** : Absent, nécessite création complète.

8. **Recherche IA** : Absente, nécessite implémentation complète (peut commencer par version simple).

---

## ✅ Fonctionnalités déjà présentes (à adapter)

- ✅ Authentification (Kinde)
- ✅ Stripe Connect (paiements)
- ✅ UploadThing (upload fichiers)
- ✅ Rich text editor (TipTap)
- ✅ Email (Resend)
- ✅ Structure Next.js 14 App Router
- ✅ UI Components (Shadcn/UI)
- ✅ Product creation form (base, à étendre)
- ✅ Product display (base, à transformer en Template)

---

**Date de création** : 2024  
**Version** : 1.0  
**Statut** : Analyse complète code actuel vs PRD V1
