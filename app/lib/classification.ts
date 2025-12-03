import slugify from 'slugify';

// ============================================
// STYLES
// ============================================

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

export type Style = typeof STYLES[number];

export const MAX_STYLES = 5;

// ============================================
// PLATFORMS
// ============================================

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

export type Platform = typeof PLATFORMS[number];

// ============================================
// TECH STACK
// ============================================

export const TECH_STACKS = ['HTML', 'REACT_VITE', 'NEXTJS'] as const;

export type TechStack = typeof TECH_STACKS[number];

// ============================================
// LIMITS
// ============================================

export const MAX_CATEGORIES = 3;
export const MAX_SUBCATEGORIES = 6;
export const MAX_TAGS = 20; // Reasonable limit

// ============================================
// UTILITIES
// ============================================

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Validate style selection (max 5)
 */
export function validateStyles(styles: string[]): boolean {
  return styles.length <= MAX_STYLES;
}

/**
 * Validate category selection (max 3)
 */
export function validateCategories(categories: string[]): boolean {
  return categories.length <= MAX_CATEGORIES;
}

/**
 * Validate subcategory selection (max 6 total)
 */
export function validateSubcategories(subcategories: string[]): boolean {
  return subcategories.length <= MAX_SUBCATEGORIES;
}

/**
 * Get style display name (formatted)
 */
export function getStyleDisplayName(style: string): string {
  return style
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: string): string {
  const platformMap: Record<string, string> = {
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
  return platformMap[platform] || platform;
}

/**
 * Get tech stack display name
 */
export function getTechStackDisplayName(techStack: string): string {
  const techMap: Record<string, string> = {
    HTML: 'HTML',
    REACT_VITE: 'React (Vite)',
    NEXTJS: 'Next.js',
  };
  return techMap[techStack] || techStack;
}
