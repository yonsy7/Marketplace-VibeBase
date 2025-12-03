import {
  Rocket,
  Smartphone,
  BarChart3,
  Sparkles,
  Moon,
  Palette,
  Zap,
  Square,
  BookOpen,
  Circle,
  Sun,
  Layers,
  History,
  Cpu,
  Layout,
  Maximize2,
  Triangle,
} from "lucide-react";
import { ReactNode } from "react";

// ===== STYLES =====
export const STYLES = [
  "clean-minimal",
  "dark-saas",
  "pastel-playful",
  "cyberpunk",
  "neo-brutalism",
  "editorial-magazine",
  "rounded-soft",
  "warm-organic",
  "gradient-fusion",
  "retro-90s",
  "futuristic-ui",
  "dashboard-modern",
  "mobile-first",
  "geometric-tech",
] as const;

export type Style = (typeof STYLES)[number];

export const styleLabels: Record<Style, string> = {
  "clean-minimal": "Clean Minimal",
  "dark-saas": "Dark SaaS",
  "pastel-playful": "Pastel Playful",
  "cyberpunk": "Cyberpunk",
  "neo-brutalism": "Neo Brutalism",
  "editorial-magazine": "Editorial Magazine",
  "rounded-soft": "Rounded Soft",
  "warm-organic": "Warm Organic",
  "gradient-fusion": "Gradient Fusion",
  "retro-90s": "Retro 90s",
  "futuristic-ui": "Futuristic UI",
  "dashboard-modern": "Dashboard Modern",
  "mobile-first": "Mobile First",
  "geometric-tech": "Geometric Tech",
};

export const styleColors: Record<Style, string> = {
  "clean-minimal": "bg-gray-100 text-gray-800 border-gray-200",
  "dark-saas": "bg-gray-900 text-white border-gray-700",
  "pastel-playful": "bg-pink-100 text-pink-800 border-pink-200",
  "cyberpunk": "bg-purple-900 text-cyan-400 border-purple-700",
  "neo-brutalism": "bg-yellow-400 text-black border-black border-2",
  "editorial-magazine": "bg-stone-100 text-stone-800 border-stone-300",
  "rounded-soft": "bg-blue-100 text-blue-800 border-blue-200",
  "warm-organic": "bg-amber-100 text-amber-900 border-amber-200",
  "gradient-fusion": "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent",
  "retro-90s": "bg-teal-400 text-purple-900 border-purple-500",
  "futuristic-ui": "bg-slate-900 text-emerald-400 border-emerald-500",
  "dashboard-modern": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "mobile-first": "bg-green-100 text-green-800 border-green-200",
  "geometric-tech": "bg-cyan-100 text-cyan-800 border-cyan-200",
};

// ===== CATEGORIES =====
export const CATEGORIES = [
  "marketing-landing",
  "product-app-ui",
  "dashboard-analytics",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface CategoryInfo {
  name: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export const categoryItems: CategoryInfo[] = [
  {
    name: "marketing-landing",
    title: "Marketing & Landing",
    description: "Landing pages, marketing sites, promotional pages",
    icon: "Rocket",
    slug: "marketing-landing",
  },
  {
    name: "product-app-ui",
    title: "Product & App UI",
    description: "Application interfaces, web apps, SaaS products",
    icon: "Smartphone",
    slug: "product-app-ui",
  },
  {
    name: "dashboard-analytics",
    title: "Dashboard & Analytics",
    description: "Admin dashboards, analytics, data visualization",
    icon: "BarChart3",
    slug: "dashboard-analytics",
  },
];

// ===== SUBCATEGORIES =====
export const SUBCATEGORIES: Record<Category, string[]> = {
  "marketing-landing": [
    "SaaS",
    "Agency",
    "Personal Brand",
    "Product Launch",
    "Waitlist",
    "Pricing",
  ],
  "product-app-ui": [
    "Auth",
    "Onboarding",
    "Settings",
    "Profile",
    "Feed",
    "Messaging",
  ],
  "dashboard-analytics": [
    "Admin",
    "Finance",
    "CRM",
    "Analytics",
    "KPI Overview",
    "Ops",
  ],
};

// ===== PLATFORMS =====
export const PLATFORMS = [
  "V0",
  "LOVABLE",
  "SUBFRAME",
  "MAGIC_PATTERNS",
  "UIZARD",
  "ONLOOK",
  "REPLIT",
  "AURA_BUILD",
  "MAGIC_PATH",
  "STITCH",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const platformLabels: Record<Platform, string> = {
  V0: "v0.dev",
  LOVABLE: "Lovable",
  SUBFRAME: "Subframe",
  MAGIC_PATTERNS: "Magic Patterns",
  UIZARD: "Uizard",
  ONLOOK: "Onlook",
  REPLIT: "Replit",
  AURA_BUILD: "Aura.build",
  MAGIC_PATH: "MagicPath",
  STITCH: "Stitch",
};

export const platformUrls: Record<Platform, string> = {
  V0: "https://v0.dev",
  LOVABLE: "https://lovable.dev",
  SUBFRAME: "https://subframe.com",
  MAGIC_PATTERNS: "https://magicpatterns.com",
  UIZARD: "https://uizard.io",
  ONLOOK: "https://onlook.dev",
  REPLIT: "https://replit.com",
  AURA_BUILD: "https://aura.build",
  MAGIC_PATH: "https://magicpath.ai",
  STITCH: "https://stitch.ai",
};

// ===== TECH STACKS =====
export const TECH_STACKS = ["HTML", "REACT_VITE", "NEXTJS"] as const;

export type TechStackType = (typeof TECH_STACKS)[number];

export const techStackLabels: Record<TechStackType, string> = {
  HTML: "HTML",
  REACT_VITE: "React (Vite)",
  NEXTJS: "Next.js",
};

export const techStackIcons: Record<TechStackType, string> = {
  HTML: "🌐",
  REACT_VITE: "⚛️",
  NEXTJS: "▲",
};

export const techStackColors: Record<TechStackType, string> = {
  HTML: "bg-orange-100 text-orange-800 border-orange-200",
  REACT_VITE: "bg-cyan-100 text-cyan-800 border-cyan-200",
  NEXTJS: "bg-black text-white border-gray-700",
};

// ===== TEMPLATE STATUS =====
export const TEMPLATE_STATUSES = [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "REJECTED",
] as const;

export type TemplateStatusType = (typeof TEMPLATE_STATUSES)[number];

export const statusLabels: Record<TemplateStatusType, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

export const statusColors: Record<TemplateStatusType, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PUBLISHED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

// ===== HELPERS =====
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function validateStyleLimit(styles: string[], max: number = 5): boolean {
  return styles.length <= max;
}

export function validateCategoryLimit(
  categories: string[],
  max: number = 3
): boolean {
  return categories.length <= max;
}

export function validateSubcategoryLimit(
  subcategories: string[],
  max: number = 6
): boolean {
  return subcategories.length <= max;
}

export function formatPrice(priceInCents: number): string {
  if (priceInCents === 0) return "Free";
  return `$${(priceInCents / 100).toFixed(2)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// ===== SEED DATA =====
export const seedStyles = STYLES.map((slug) => ({
  name: styleLabels[slug],
  slug,
}));

export const seedCategories = categoryItems.map((cat) => ({
  name: cat.title,
  slug: cat.slug,
  description: cat.description,
  icon: cat.icon,
}));

export const seedSubcategories = Object.entries(SUBCATEGORIES).flatMap(
  ([categorySlug, subs]) =>
    subs.map((name) => ({
      name,
      slug: generateSlug(name),
      categorySlug,
    }))
);
