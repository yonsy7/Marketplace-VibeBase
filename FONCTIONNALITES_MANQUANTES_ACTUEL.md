# 🔍 Fonctionnalités Manquantes - État Actuel

**Date**: 2024-12-03  
**État**: Après implémentation des fonctionnalités principales

---

## ✅ Fonctionnalités Déjà Implémentées

### Espace Créateur
- ✅ Édition Template (`/creator/templates/[id]/edit`)
- ✅ Suppression Template (DeleteTemplateDialog)
- ✅ Profil Créateur (`/creator/profile`)
- ✅ Page Créateur Publique (`/creator/[username]`)

### Explorer & Filtres
- ✅ Filtres complets dans FilterSidebar (styles, catégories, sous-catégories, tags, plateformes, prix)
- ✅ Range slider pour prix
- ✅ Intégration reviews dans page template

### Admin
- ✅ Gestion reviews admin (`/admin/reviews`)

### SEO & Polish
- ✅ Footer avec liens
- ✅ Pages 404 et 500
- ✅ Pages légales (Terms, Privacy)
- ✅ Metadata de base dans layout

### Redirections
- ✅ Redirections anciennes routes (`/product/[id]` → `/templates/[slug]`)

---

## 🔴 Fonctionnalités Manquantes Critiques (P0)

### 1. **Vector Search / Embeddings Complets** 🔴
**Priorité**: Haute - Système IA incomplet

- ⬜ **Vector Store Setup**
  - Décider entre Supabase pgvector ou Pinecone
  - Créer table/index pour embeddings dans Prisma schema
  - Migration pour ajouter colonne `embedding` ou table séparée

- ⬜ **Génération Embeddings Templates**
  - Fonction `generateTemplateEmbedding(template)` complète
  - Concaténation: title + shortDesc + styles + categories + tags + techStack + platforms
  - Stockage dans vector store

- ⬜ **Indexation Automatique**
  - Hook dans `createTemplate` → générer et stocker embedding
  - Hook dans `updateTemplate` → re-générer et mettre à jour embedding
  - Hook dans `deleteTemplate` → supprimer embedding

- ⬜ **Script Batch Embeddings**
  - Script pour générer embeddings pour tous les templates existants
  - Commande: `npm run generate-embeddings`

- ⬜ **Vector Search dans API**
  - Mettre à jour `/api/ai/suggest-templates/route.ts`
  - Remplacer recherche textuelle par vector similarity search
  - Utiliser cosine similarity pour ranking

**Fichiers à créer/modifier:**
- `prisma/schema.prisma` - Ajouter modèle/colonne pour embeddings
- `app/lib/embeddings.ts` - Fonctions génération/storage embeddings
- `app/scripts/generate-embeddings.ts` - Script batch
- `app/api/ai/suggest-templates/route.ts` - Implémenter vector search

---

## 🟡 Fonctionnalités Manquantes Importantes (P1)

### 2. **Sitemap et Robots.txt** 🟡
**Priorité**: Moyenne - SEO important

- ⬜ **`app/sitemap.ts`**
  - Sitemap dynamique avec tous les templates publiés
  - Inclure pages: `/`, `/templates`, `/templates/[slug]`, `/creator/[username]`
  - Priorités et fréquences de mise à jour

- ⬜ **`app/robots.ts`**
  - Autoriser tous les bots
  - Sitemap URL
  - Exclure routes admin/creator privées

**Fichiers à créer:**
- `app/sitemap.ts`
- `app/robots.ts`

### 3. **Dark Mode Toggle** 🟡
**Priorité**: Moyenne - UX moderne

- ⬜ **`components/ThemeToggle.tsx`**
  - Toggle switch pour dark/light mode
  - Utiliser `next-themes`

- ⬜ **ThemeProvider dans layout**
  - Ajouter `ThemeProvider` de `next-themes` dans `app/layout.tsx`
  - Configurer `attribute="class"` et `defaultTheme="system"`

- ⬜ **Intégration dans Navbar**
  - Ajouter ThemeToggle dans `Navbar.tsx` ou `UserNav.tsx`

**Fichiers à créer/modifier:**
- `components/ThemeToggle.tsx`
- `app/layout.tsx` - Ajouter ThemeProvider
- `app/components/Navbar.tsx` ou `app/components/UserNav.tsx` - Ajouter toggle

**Dépendances à installer:**
```bash
npm install next-themes
```

### 4. **Breadcrumbs Navigation** 🟡
**Priorité**: Moyenne - UX navigation

- ⬜ **`components/layout/Breadcrumbs.tsx`**
  - Composant réutilisable pour fil d'Ariane
  - Support des liens dynamiques

- ⬜ **Intégration dans pages**
  - Ajouter dans `/templates/[slug]/page.tsx`
  - Ajouter dans `/creator/[username]/page.tsx`
  - Ajouter dans `/creator/templates/[id]/edit/page.tsx`

**Fichiers à créer/modifier:**
- `app/components/layout/Breadcrumbs.tsx`
- Pages concernées

### 5. **Emails Templates Manquants** 🟡
**Priorité**: Moyenne - Communication importante

- ⬜ **`TemplateApprovedEmail.tsx`**
  - Email envoyé au créateur quand template approuvé
  - Lien vers template publié

- ⬜ **`TemplateRejectedEmail.tsx`**
  - Email envoyé au créateur quand template rejeté
  - Raison du rejet

- ⬜ **`NewSaleEmail.tsx`**
  - Email envoyé au créateur lors d'une nouvelle vente
  - Détails de la vente (template, montant, commission)

- ⬜ **Mettre à jour `ProductEmail` → `PurchaseEmail`**
  - Renommer et adapter pour templates

**Fichiers à créer/modifier:**
- `app/components/emails/TemplateApprovedEmail.tsx`
- `app/components/emails/TemplateRejectedEmail.tsx`
- `app/components/emails/NewSaleEmail.tsx`
- `app/components/ProductEmail.tsx` → `PurchaseEmail.tsx`

**Actions à modifier:**
- `app/api/admin/templates/[id]/approve/route.ts` - Envoyer email
- `app/api/admin/templates/[id]/reject/route.ts` - Envoyer email
- `app/api/stripe/route.ts` - Envoyer email au créateur

---

## 🟢 Fonctionnalités Manquantes Nice-to-Have (P2)

### 6. **Navigation Updates** 🟢
**Priorité**: Basse - Amélioration UX

- ⬜ **Mettre à jour `NavbarLinks`**
  - Ajouter liens vers nouvelles catégories si nécessaire
  - Vérifier cohérence avec nouvelles routes

- ⬜ **Mettre à jour `MobileMenu`**
  - Ajouter liens espace créateur si rôle CREATOR
  - Ajouter lien admin si rôle ADMIN

**Fichiers à modifier:**
- `app/components/NavbarLinks.tsx`
- `app/components/MobileMenu.tsx`

### 7. **Metadata Dynamiques Complètes** 🟢
**Priorité**: Basse - SEO amélioré

- ⬜ **Metadata pour `/templates/[slug]`**
  - ✅ Déjà partiellement fait (generateMetadata existe)
  - Vérifier complétude (Open Graph, Twitter cards)

- ⬜ **Metadata pour `/creator/[username]`**
  - ✅ Déjà partiellement fait (generateMetadata existe)
  - Vérifier complétude

- ⬜ **Image Open Graph par défaut**
  - Créer image OG par défaut dans `/public/og-image.png`
  - Référencer dans metadata layout

### 8. **Migration Base de Données** 🟢
**Priorité**: Basse - À faire avant production

- ⬜ **Exécuter migration Prisma**
  ```bash
  npx prisma migrate dev --name v1_marketplace_schema
  ```

- ⬜ **Exécuter seed**
  ```bash
  npm run db:seed
  ```

- ⬜ **Script migration Product → Template**
  - Script pour migrer données existantes de `Product` vers `Template`
  - Créer slugs depuis noms
  - Mapper catégories

- ⬜ **Supprimer ancien modèle Product**
  - Après validation migration
  - Supprimer de `prisma/schema.prisma`
  - Migration de suppression

---

## 📊 Résumé

| Catégorie | Manquant | Priorité |
|-----------|----------|----------|
| Vector Search / Embeddings | 5 tâches | 🔴 Haute |
| Sitemap & Robots | 2 tâches | 🟡 Moyenne |
| Dark Mode | 3 tâches | 🟡 Moyenne |
| Breadcrumbs | 2 tâches | 🟡 Moyenne |
| Emails Templates | 4 tâches | 🟡 Moyenne |
| Navigation Updates | 2 tâches | 🟢 Basse |
| Metadata Complètes | 3 tâches | 🟢 Basse |
| Migration BDD | 4 tâches | 🟢 Basse |

**Total**: ~25 tâches restantes

**Progression globale**: ~85% complète

---

## 🎯 Recommandations d'Implémentation

### Phase 1 (Immédiat - P0)
1. **Vector Search / Embeddings** - Système IA complet
   - Setup vector store (pgvector recommandé si Supabase)
   - Génération embeddings
   - Indexation automatique
   - Vector search dans API

### Phase 2 (Court Terme - P1)
2. **Sitemap & Robots.txt** - SEO
3. **Dark Mode** - UX moderne
4. **Breadcrumbs** - Navigation
5. **Emails Templates** - Communication

### Phase 3 (Moyen Terme - P2)
6. **Navigation Updates** - Polish
7. **Metadata Complètes** - SEO avancé
8. **Migration BDD** - Production ready

---

*Document mis à jour le: 2024-12-03*
