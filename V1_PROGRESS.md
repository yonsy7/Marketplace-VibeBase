# V1 Marketplace – Progress Report

_Date:_ 3 Dec 2025  
_Prepared by:_ GPT-5.1 Codex

## Completed Tasks

| Phase | ID | Description | Details |
|-------|----|-------------|---------|
| Phase 0 – Préparation | 0.3.1 | Corriger l'email hardcodé dans le webhook Stripe | `app/api/stripe/route.ts` utilise désormais `session.customer_details?.email ?? session.customer_email` pour envoyer le lien de téléchargement au véritable acheteur et journalise l'absence d'email. |
| Phase 0 – Préparation | 0.3.2 | Corriger l'email hardcodé dans `SettingsForm` | `app/components/form/SettingsForm.tsx` injecte maintenant la prop `email` dans l'input désactivé afin d'afficher la vraie adresse de l'utilisateur. |
| Phase 0 – Préparation | 0.3.3 | Corriger l'email hardcodé dans `UserNav` | `app/components/UserNav.tsx` affiche la valeur `email` passée en prop dans le menu utilisateur. |

## Features Delivered / Bugs Résolus

- **Emails d'achat fiables** : le webhook Stripe envoie les téléchargements Resend au client réel, éliminant les pertes de livrables et permettant d'étendre facilement la logique `Order` lors des phases ultérieures.
- **Paramètres cohérents** : la page `Settings` reflète maintenant l'adresse Kinde de l'utilisateur, ce qui évite les confusions lors de la configuration du compte ou de Stripe Connect.
- **Menu utilisateur précis** : le dropdown utilisateur montre l'adresse réelle pour faciliter les vérifications de session et la validation des rôles futures (creator/admin).

## Points Bloquants Restants

- **Portée du PRD** : `TASKS.md` répertorie 225 tâches couvrant migrations Prisma complètes, refonte des routes, nouvelles pages (explorer, créateur, admin), filtres avancés, IA, paiements et SEO. Ces chantiers exigent plusieurs semaines-homme et un enchaînement de migrations critiques.
- **Manque d'accès environnement** : l'exécution des phases 1+ nécessite une base PostgreSQL dédiée, des seeds structurés, des clés Stripe/OpenAI/UploadThing, ainsi qu'un vector store pour l'IA. Aucun de ces éléments n'est disponible dans l'environnement actuel, ce qui empêche toute migration de données et tout test fiable.
- **Dépendances fonctionnelles** : la plupart des features demandées (templates, favoris, reviews, admin, IA) dépendent d'un nouveau schéma (`Template`, `Order`, `Favorite`, etc.) inexistant dans `prisma/schema.prisma`. Sans définition claire des données sources (products existants, assets, contenus), il n'est pas possible de finaliser les phases suivantes.

## Recommandations Immédiates

1. **Fournir la base de données ou un dump** pour permettre la migration vers les nouveaux modèles (`Template`, `Order`, `Review`, etc.).
2. **Partager les secrets d'environnement** (Stripe, Resend, UploadThing, OpenAI) ou des clés de test afin de valider les nouvelles routes et les futures intégrations IA.
3. **Prioriser les phases** : finaliser Phase 1 (schéma + seeds) avant d'entamer la refonte front (Phases 2–5) et l'espace créateur/admin.
4. **Définir la stratégie de migration** (big bang vs progressive) et documenter les règles de mapping Product → Template pour sécuriser les futures étapes.

Une fois ces prérequis levés, nous pourrons enchaîner la migration Prisma, créer les nouveaux composants de classification, refondre les routes `/templates`, construire l'espace créateur/admin et intégrer l'IA comme décrit dans `TASKS.md` et `MISSING_FEATURES.md`.
