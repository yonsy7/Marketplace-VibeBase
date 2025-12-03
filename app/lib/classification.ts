// Classification constants and types

export const STYLES = [
  'clean-minimal',
  'dark-saas',
  'pastel-playful',
  'cyberpunk',
  'neo-brutalism',
  'editorial-magazine',
  'rounded-soft',
  'warm-organic',
  'gradient-fusion',
  'retro-90s',
  'futuristic-ui',
  'dashboard-modern',
  'mobile-first',
  'geometric-tech',
] as const;

export const CATEGORIES = [
  'Marketing & Landing',
  'Product & App UI',
  'Dashboard & Analytics',
] as const;

export const SUBCATEGORIES = {
  'Marketing & Landing': [
    'SaaS',
    'Agency',
    'Personal brand',
    'Product launch',
    'Waitlist',
    'Pricing',
  ],
  'Product & App UI': [
    'Auth',
    'Onboarding',
    'Settings',
    'Profile',
    'Feed',
    'Messaging',
  ],
  'Dashboard & Analytics': [
    'Admin',
    'Finance',
    'CRM',
    'Analytics',
    'KPI Overview',
    'Ops',
  ],
} as const;

export const PLATFORMS = [
  'V0',
  'LOVABLE',
  'SUBFRAME',
  'MAGIC_PATTERNS',
  'UIZARD',
  'ONLOOK',
  'REPLIT',
  'AURA_BUILD',
  'MAGIC_PATH',
  'STITCH',
] as const;

export const TECH_STACKS = ['HTML', 'REACT_VITE', 'NEXTJS'] as const;

export type Style = typeof STYLES[number];
export type Category = typeof CATEGORIES[number];
export type Platform = typeof PLATFORMS[number];
export type TechStack = typeof TECH_STACKS[number];

// Validation limits
export const MAX_STYLES = 5;
export const MAX_CATEGORIES = 3;
export const MAX_SUBCATEGORIES = 6;
export const MAX_TAGS = 20; // Reasonable limit

// Slug generation utility
import slugify from 'slugify';

export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Validation helpers
export function validateStyles(styles: string[]): boolean {
  return styles.length <= MAX_STYLES && styles.every(s => STYLES.includes(s as Style));
}

export function validateCategories(categories: string[]): boolean {
  return categories.length <= MAX_CATEGORIES && categories.every(c => CATEGORIES.includes(c as Category));
}

export function validateSubcategories(subcategories: string[]): boolean {
  return subcategories.length <= MAX_SUBCATEGORIES;
}

// Platform display names
export const PLATFORM_DISPLAY_NAMES: Record<Platform, string> = {
  V0: 'v0.dev',
  LOVABLE: 'Lovable',
  SUBFRAME: 'Subframe',
  MAGIC_PATTERNS: 'Magic Patterns',
  UIZARD: 'Uizard',
  ONLOOK: 'Onlook',
  REPLIT: 'Replit Design Mode',
  AURA_BUILD: 'Aura.build',
  MAGIC_PATH: 'MagicPath',
  STITCH: 'Stitch',
};

// Tech stack display names
export const TECH_STACK_DISPLAY_NAMES: Record<TechStack, string> = {
  HTML: 'HTML',
  REACT_VITE: 'React (Vite)',
  NEXTJS: 'Next.js',
};
