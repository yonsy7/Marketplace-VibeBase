# 🔍 Analyse des Fonctionnalités Manquantes

## PRD V1 Marketplace - AI-Ready Design Templates

**Document de référence** : PRD V1 Marketplace pour templates HTML/React/Next.js AI-Ready

**État actuel** : Marketplace générique de templates Tailwind CSS (MarshalUI)

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
| `TemplateFile` | P0 | Gestion des fichiers uploadés |
| `StyleTag` | P0 | Tags de styles visuels |
| `TemplateStyleTag` | P0 | Relation many-to-many |
| `Category` | P0 | Catégories principales |
| `Subcategory` | P0 | Sous-catégories |
| `TemplateCategory` | P0 | Relation many-to-many |
| `TemplateSubcategory` | P0 | Relation many-to-many |
| `Tag` | P1 | Tags libres/semi-contrôlés |
| `TemplateTag` | P1 | Relation many-to-many |
| `TemplatePlatform` | P0 | Plateformes IA compatibles |
| `Order` | P0 | Historique des commandes |
| `Review` | P1 | Avis et notes |
| `Favorite` | P1 | Favoris utilisateur |

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

| Champ | Type | Description |
|-------|------|-------------|
| `username` | String @unique | Nom d'utilisateur public |
| `bio` | String? | Biographie courte |
| `role` | UserRole | Rôle utilisateur (USER, CREATOR, ADMIN) |

### 1.4 Transformation Product → Template

| Champ Existant | Transformation | Nouveau Champ |
|----------------|----------------|---------------|
| `name` | → | `title` |
| `smallDescription` | → | `shortDesc` |
| `description` | → | `longDesc` |
| `category` | Supprimer | Via `TemplateCategory` |
| `productFile` | Supprimer | Via `TemplateFile` |
| - | Ajouter | `slug` (unique) |
| - | Ajouter | `byline` |
| - | Ajouter | `status` (TemplateStatus) |
| - | Ajouter | `techStack` (TechStack) |
| - | Ajouter | `previewFileId` |
| - | Ajouter | `previewImages` (Json) |
| - | Ajouter | `liveDemoUrl` |
| - | Ajouter | `ratingAverage` |
| - | Ajouter | `ratingCount` |
| - | Ajouter | `likeCount` |

---

## 🏠 2. Page d'Accueil (Home)

### 2.1 État Actuel

```
✅ Hero text simple
✅ ProductRow par catégorie (newest, templates, icons, uikits)
```

### 2.2 Fonctionnalités Manquantes

#### ❌ Bloc 1 — AI Template Finder (Hero) [P0]

| Élément | État | Description |
|---------|------|-------------|
| Textarea IA fullwidth | ❌ | Placeholder: "Décris ton besoin..." |
| Bouton "Trouver mes templates" | ❌ | POST vers /api/ai/suggest-templates |
| Affichage résultats IA (3-6 cartes) | ❌ | Avec score, explication |
| États: loading, erreur, aucun résultat | ❌ | Skeletons, fallback |

#### ❌ Bloc 2 — Styles populaires [P0]

| Élément | État | Description |
|---------|------|-------------|
| Titre "Popular styles" | ❌ | |
| Chips de styles cliquables | ❌ | clean-minimal, dark-saas, etc. |
| Navigation vers /templates?style=X | ❌ | |

#### ❌ Bloc 3 — Catégories [P0]

| Élément | État | Description |
|---------|------|-------------|
| 3 grandes cartes catégories | ❌ | Marketing & Landing, Product & App UI, Dashboard & Analytics |
| Icône + description + CTA | ❌ | |

#### ❌ Bloc 4 — Plateformes IA [P0]

| Élément | État | Description |
|---------|------|-------------|
| Bande d'icônes cliquables | ❌ | v0.dev, Lovable, Subframe, etc. |
| Navigation vers /templates?platform=X | ❌ | |

#### ❌ Bloc 5 — Templates populaires [P1]

| Élément | État | Description |
|---------|------|-------------|
| Titre "Popular templates" | ❌ | |
| 4-8 templates (ventes + likes + vues + rating) | ❌ | Algorithme de scoring |

#### ❌ Bloc 6 — Nouveaux templates [P1]

| Élément | État | Description |
|---------|------|-------------|
| Titre "New arrivals" | ❌ | |
| 4-8 derniers templates publiés | ❌ | |

#### ❌ Bloc 7 — Créateurs mis en avant (optionnel V1) [P2]

| Élément | État | Description |
|---------|------|-------------|
| 2-4 profils créateurs | ❌ | |
| Stats simplifiées | ❌ | nb templates, rating moyen |

---

## 🔎 3. Explorer /templates

### 3.1 État Actuel

```
✅ Page /products/[category] simple
✅ Grille de ProductCard
❌ Pas de filtres avancés
❌ Pas de pagination/infinite scroll
```

### 3.2 Fonctionnalités Manquantes

#### ❌ Barre de filtres [P0]

| Filtre | État | Type |
|--------|------|------|
| Styles | ❌ | Multi-select (chips) |
| Catégories | ❌ | Multi-select |
| Sous-catégories | ❌ | Multi-select (filtré par catégories) |
| Tags | ❌ | Multi-select/search |
| Tech Stack | ❌ | HTML / React Vite / Next.js |
| IA Platforms | ❌ | Multi-select |
| Prix | ❌ | Free / Paid / Range slider |

#### ❌ Options de tri [P0]

| Option | État |
|--------|------|
| Récent | ❌ |
| Populaire | ❌ |
| Prix croissant | ❌ |
| Meilleure note | ❌ |
| Plus likés | ❌ |

#### ❌ Affichage [P1]

| Élément | État |
|---------|------|
| Pagination | ❌ |
| Infinite scroll | ❌ |
| URL avec query params | ❌ |

---

## 📄 4. Page Template /templates/[slug]

### 4.1 État Actuel

```
✅ Carousel d'images
✅ Nom, prix, description courte
✅ Description longue (TipTap)
✅ Bouton Buy (Stripe Checkout)
✅ Infos créateur basiques (avatar, prénom)
❌ Pas de slug (utilise ID)
```

### 4.2 Fonctionnalités Manquantes

#### ❌ Header enrichi [P0]

| Élément | État | Description |
|---------|------|-------------|
| Byline | ❌ | Sous-titre optionnel |
| Styles (badges) | ❌ | Liste des styles associés |
| Catégories & sous-catégories | ❌ | |
| Tags | ❌ | |
| Tech stack | ❌ | Badge HTML/Vite/Next.js |
| Plateformes IA | ❌ | Icônes des plateformes compatibles |
| Rating moyen + nb reviews | ❌ | ★ 4.5 (23 reviews) |
| Nombre de likes | ❌ | ❤️ 45 |
| Lien vers page créateur | ❌ | /creator/[username] |

#### ❌ Preview conditionnelle [P0]

| Tech Stack | Preview | État |
|------------|---------|------|
| HTML | iframe sandbox | ❌ |
| React Vite | iframe liveDemoUrl | ❌ |
| Next.js | iframe liveDemoUrl + bouton | ❌ |

#### ❌ Likes / Favoris [P1]

| Élément | État |
|---------|------|
| Bouton toggle like | ❌ |
| Compteur de favoris | ❌ |
| Persistence en BDD | ❌ |

#### ❌ Reviews & Ratings [P1]

| Élément | État |
|---------|------|
| Sommaire (moyenne, nb reviews) | ❌ |
| Liste des reviews | ❌ |
| Pagination reviews | ❌ |
| Formulaire ajout/édition review | ❌ |
| Restriction: acheteurs uniquement | ❌ |
| 1 review par user/template | ❌ |

#### ❌ Cross-selling [P2]

| Élément | État |
|---------|------|
| "More from this creator" | ❌ |
| "Similar templates" | ❌ |

---

## 💳 5. Paiement & Téléchargement

### 5.1 État Actuel

```
✅ Stripe Checkout avec Connect
✅ Pages success/cancel basiques
✅ Email avec lien de téléchargement
❌ Pas de page de téléchargement sécurisée
❌ Pas de modèle Order en BDD
```

### 5.2 Fonctionnalités Manquantes

#### ❌ Modèle Order [P0]

| Champ | Type | Description |
|-------|------|-------------|
| id | String | |
| buyerId | String | |
| templateId | String | |
| paymentIntentId | String | |
| downloadAvailable | Boolean | |
| createdAt | DateTime | |

#### ❌ Page /download/[orderId] [P0]

| Élément | État |
|---------|------|
| Vérification order.buyerId = currentUser | ❌ |
| Liste des fichiers téléchargeables | ❌ |
| Liens de téléchargement sécurisés | ❌ |

---

## ❤️ 6. Favoris Utilisateur

### 6.1 État Actuel

```
❌ Aucune fonctionnalité de favoris
```

### 6.2 Fonctionnalités Manquantes

#### ❌ Page /user/favorites [P1]

| Élément | État |
|---------|------|
| Liste des templates likés | ❌ |
| Cartes cliquables vers /templates/[slug] | ❌ |
| Bouton unlike | ❌ |

---

## 👨‍🎨 7. Espace Créateur

### 7.1 État Actuel

```
✅ Page /sell avec formulaire basique
✅ Page /my-products (liste simple)
✅ Page /billing (Stripe Connect)
✅ Page /settings (firstName, lastName)
❌ Pas de dashboard avec stats
❌ Pas de gestion de statut (draft/pending/published)
❌ Pas de page créateur publique
```

### 7.2 Fonctionnalités Manquantes

#### ❌ Dashboard /creator/dashboard [P0]

| Élément | État |
|---------|------|
| Total ventes | ❌ |
| Revenus cumulés | ❌ |
| Rating moyen | ❌ |
| Total favoris | ❌ |
| Tableau templates avec statuts | ❌ |
| Actions: éditer, voir, supprimer | ❌ |

#### ❌ Liste templates /creator/templates [P0]

| Élément | État |
|---------|------|
| Vue liste complète | ❌ |
| Tri par statut/date | ❌ |
| Filtres par statut | ❌ |

#### ❌ Formulaire création /creator/templates/new [P0]

| Section | État | Détails |
|---------|------|---------|
| **Visuels** | ⚠️ Partiel | 2-4 images (actuellement 5 max) |
| **Infos de base** | ⚠️ Partiel | Manque: byline (80 chars) |
| **Classification** | ❌ | Categories (0/3), Styles (0/5), Subcategories (0/6), Tags |
| **Tech & IA** | ❌ | Tech Stack (radio), IA Platforms (multi-select) |
| **Fichiers** | ⚠️ Partiel | Logique conditionnelle selon TechStack manquante |
| **Pricing** | ⚠️ Partiel | Toggle Paid/Free manquant |
| **Full Description** | ✅ | TipTap existant |
| **Actions** | ❌ | Save as Draft, Submit for Review |

##### Logique fichiers selon TechStack

| TechStack | Upload | État |
|-----------|--------|------|
| HTML | Multi-fichiers (.html, .css, .js, images) + "Set as preview" | ❌ |
| React Vite | .zip + liveDemoUrl (obligatoire) | ❌ |
| Next.js | .zip + liveDemoUrl (obligatoire) | ❌ |

#### ❌ Édition /creator/templates/[id]/edit [P0]

| Élément | État |
|---------|------|
| Même structure que new | ❌ |
| Chargement données existantes | ❌ |
| Gestion transition PUBLISHED → PENDING | ❌ |

#### ❌ Profil créateur /creator/profile [P1]

| Élément | État |
|---------|------|
| Username unique | ❌ |
| Bio courte | ❌ |
| Avatar | ❌ |
| Intégration Stripe Connect | ⚠️ Partiel (dans /billing) |

#### ❌ Page publique /creator/[username] [P1]

| Élément | État |
|---------|------|
| Avatar, nom, bio | ❌ |
| Styles & catégories dominants | ❌ |
| Rating moyen global | ❌ |
| Total likes | ❌ |
| Liste templates publiés | ❌ |
| Filtres (style, catégorie, stack, platform) | ❌ |

---

## 🛡️ 8. Espace Admin

### 8.1 État Actuel

```
❌ Aucune fonctionnalité admin
```

### 8.2 Fonctionnalités Manquantes

#### ❌ Dashboard /admin [P0]

| Élément | État |
|---------|------|
| Nb templates par statut | ❌ |
| Nb ventes | ❌ |
| Top templates | ❌ |
| Liste templates PENDING | ❌ |

#### ❌ Gestion templates /admin/templates [P0]

| Élément | État |
|---------|------|
| Liste complète avec filtres | ❌ |
| Vue détaillée /admin/templates/[id] | ❌ |
| Action: Approve → PUBLISHED | ❌ |
| Action: Reject → REJECTED (+ message) | ❌ |

#### ❌ Gestion reviews /admin/reviews [P1]

| Élément | État |
|---------|------|
| Liste toutes les reviews | ❌ |
| Tri/filtre par template, score, date | ❌ |
| Action: supprimer review abusive | ❌ |

---

## 🤖 9. IA & Recommandation

### 9.1 État Actuel

```
❌ Aucune fonctionnalité IA
```

### 9.2 Fonctionnalités Manquantes

#### ❌ Endpoint POST /api/ai/suggest-templates [P0]

| Élément | État |
|---------|------|
| Input: query (texte libre) | ❌ |
| Output: templates[] avec score + explanation | ❌ |

#### ❌ Logique IA [P0]

| Élément | État |
|---------|------|
| Embeddings (titre, descriptions, styles, catégories, tags) | ❌ |
| Similarité vectorielle | ❌ |
| Reranking (rating, likes, ventes) | ❌ |
| Maximum 6 templates | ❌ |

#### ❌ Infrastructure requise [P0]

| Élément | Options |
|---------|---------|
| Provider Embeddings | OpenAI, Cohere, etc. |
| Vector Store | Pinecone, Supabase pgvector, etc. |
| LLM pour reranking (optionnel) | GPT-4, Claude |

---

## 🎨 10. Système de Classification

### 10.1 État Actuel

```
✅ 3 catégories simples (template, uikit, icon)
❌ Pas de styles
❌ Pas de sous-catégories
❌ Pas de tags
❌ Pas de plateformes IA
❌ Pas de tech stack
```

### 10.2 Styles à implémenter [P0]

```
clean-minimal, dark-saas, pastel-playful, cyberpunk,
neo-brutalism, editorial-magazine, rounded-soft,
warm-organic, gradient-fusion, retro-90s, futuristic-ui,
dashboard-modern, mobile-first, geometric-tech
```
*Règle: jusqu'à 5 styles par template*

### 10.3 Catégories à implémenter [P0]

```
Marketing & Landing, Product & App UI, Dashboard & Analytics
```
*Règle: jusqu'à 3 catégories par template*

### 10.4 Sous-catégories à implémenter [P0]

| Catégorie | Sous-catégories |
|-----------|-----------------|
| Marketing & Landing | SaaS, Agency, Personal brand, Product launch, Waitlist, Pricing |
| Product & App UI | Auth, Onboarding, Settings, Profile, Feed, Messaging |
| Dashboard & Analytics | Admin, Finance, CRM, Analytics, KPI Overview, Ops |

*Règle: jusqu'à 6 sous-catégories par template (toutes catégories confondues)*

### 10.5 Plateformes IA à implémenter [P0]

```
v0.dev, Lovable, Subframe, Magic Patterns, Uizard,
Onlook, Replit Design Mode, Aura.build, MagicPath, Stitch
```

### 10.6 Tech Stack à implémenter [P0]

```
HTML, React (Vite), Next.js
```

---

## 📁 11. Routes Manquantes

### 11.1 Architecture cible vs actuelle

| Route | État | Notes |
|-------|------|-------|
| `/` | ⚠️ Refonte | Ajouter tous les blocs Hero IA, styles, etc. |
| `/templates` | ❌ | Explorer avec filtres |
| `/templates/[slug]` | ⚠️ Refonte | Actuellement /product/[id] |
| `/creator/[username]` | ❌ | Page créateur publique |
| `/creator/dashboard` | ❌ | Dashboard créateur |
| `/creator/templates` | ❌ | Liste templates créateur |
| `/creator/templates/new` | ⚠️ Refonte | Actuellement /sell |
| `/creator/templates/[id]/edit` | ❌ | Édition template |
| `/creator/profile` | ❌ | Profil créateur |
| `/user/favorites` | ❌ | Favoris utilisateur |
| `/purchase/success` | ⚠️ Renommer | Actuellement /payment/success |
| `/purchase/cancel` | ⚠️ Renommer | Actuellement /payment/cancel |
| `/download/[orderId]` | ❌ | Téléchargement sécurisé |
| `/admin` | ❌ | Dashboard admin |
| `/admin/templates` | ❌ | Gestion templates |
| `/admin/templates/[id]` | ❌ | Détail template admin |
| `/admin/reviews` | ❌ | Gestion reviews |
| `/admin/reviews/[id]` | ❌ | Détail review admin |

### 11.2 API Routes Manquantes

| Route | Méthode | État |
|-------|---------|------|
| `/api/ai/suggest-templates` | POST | ❌ |
| `/api/templates` | GET | ❌ (avec filtres) |
| `/api/templates/[slug]` | GET | ❌ |
| `/api/favorites` | GET, POST, DELETE | ❌ |
| `/api/reviews` | GET, POST, PUT, DELETE | ❌ |
| `/api/admin/templates/[id]/approve` | POST | ❌ |
| `/api/admin/templates/[id]/reject` | POST | ❌ |

---

## 🧩 12. Composants UI Manquants

### 12.1 Composants à créer

| Composant | Priorité | Description |
|-----------|----------|-------------|
| `AISearchBox` | P0 | Textarea + bouton recherche IA |
| `AIResultsGrid` | P0 | Grille résultats IA avec scores |
| `StyleChips` | P0 | Liste de chips styles cliquables |
| `CategoryCards` | P0 | 3 grandes cartes catégories |
| `PlatformIcons` | P0 | Bande d'icônes plateformes IA |
| `TemplateCard` | P0 | Refonte ProductCard avec styles, rating, likes |
| `FilterSidebar` | P0 | Barre de filtres latérale |
| `TechStackBadge` | P0 | Badge HTML/Vite/Next.js |
| `RatingStars` | P1 | Affichage ★ 1-5 |
| `LikeButton` | P1 | Toggle like avec compteur |
| `ReviewCard` | P1 | Affichage d'une review |
| `ReviewForm` | P1 | Formulaire review (rating + commentaire) |
| `FileUploadConditional` | P0 | Upload fichiers selon TechStack |
| `PreviewIframe` | P0 | Preview conditionnelle HTML/Vite/Next.js |
| `StatusBadge` | P0 | Badge DRAFT/PENDING/PUBLISHED/REJECTED |
| `CreatorStats` | P1 | Stats créateur (ventes, revenus, rating) |

---

## 📊 13. Récapitulatif par Priorité

### P0 — Critique (MVP)

1. ✏️ Migration schéma Prisma (Template, styles, catégories, etc.)
2. 🏠 Refonte page d'accueil avec blocs PRD
3. 🔎 Page Explorer avec filtres complets
4. 📄 Refonte page template (slug, header enrichi, preview)
5. 👨‍🎨 Dashboard créateur + formulaire création enrichi
6. 🛡️ Dashboard admin + modération
7. 🤖 Endpoint IA suggest-templates
8. 💾 Modèle Order + page download sécurisée
9. 🔐 Gestion rôles (USER, CREATOR, ADMIN)

### P1 — Important

1. ❤️ Système favoris (modèle + UI + page)
2. ⭐ Système reviews (modèle + UI + restrictions)
3. 👤 Page créateur publique
4. 📊 Stats créateur détaillées
5. 🎨 Cross-selling ("More from creator", "Similar templates")

### P2 — Nice to have

1. 🧑‍🎨 Créateurs mis en avant sur homepage
2. 📈 Analytics avancées
3. 🔔 Notifications
4. 🌐 Multi-devises

---

## 🛠️ 14. Actions Recommandées

### Phase 1 : Fondations (Semaines 1-2)

1. **Migration schéma Prisma**
   - Créer les nouveaux modèles
   - Migration des données existantes Product → Template
   - Seeds pour styles, catégories, sous-catégories

2. **Restructuration routes**
   - Renommer /product → /templates
   - Créer structure /creator/*
   - Créer structure /admin/*

### Phase 2 : Core Features (Semaines 3-4)

3. **Formulaire création enrichi**
   - Classification (styles, catégories, sous-catégories, tags)
   - Tech Stack + plateformes IA
   - Upload conditionnel selon TechStack
   - Statuts (Draft, Pending)

4. **Page Explorer**
   - Filtres multi-critères
   - URL avec query params
   - Pagination

### Phase 3 : IA & Admin (Semaines 5-6)

5. **Système IA**
   - Setup embeddings + vector store
   - Endpoint suggest-templates
   - Intégration homepage

6. **Admin**
   - Dashboard stats
   - Modération templates
   - Workflow approve/reject

### Phase 4 : Engagement (Semaines 7-8)

7. **Favoris & Reviews**
   - Modèles Prisma
   - UI composants
   - Restrictions (acheteurs pour reviews)

8. **Pages créateurs**
   - Profil public
   - Stats détaillées
   - Dashboard amélioré

---

## 📝 Notes Additionnelles

### Dépendances Techniques à Ajouter

```json
{
  "openai": "^4.x", // Pour embeddings
  "@pinecone-database/pinecone": "^2.x", // Ou autre vector store
  "slugify": "^1.x" // Pour génération de slugs
}
```

### Variables d'Environnement Additionnelles

```bash
# IA
OPENAI_API_KEY=sk-xxx
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=xxx
PINECONE_INDEX=xxx
```

### Considérations de Migration

- Les products existants devront être migrés vers le nouveau modèle Template
- Prévoir une période de coexistence ou une migration complète
- Les utilisateurs existants devront choisir un username unique
- Les catégories actuelles (template, uikit, icon) ne correspondent pas au PRD

---

*Document généré le 3 décembre 2024*
*Basé sur l'analyse du code actuel vs PRD V1 Marketplace*
