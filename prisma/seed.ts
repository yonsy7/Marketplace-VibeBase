import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Style tags data
const styles = [
  { name: "Clean Minimal", slug: "clean-minimal" },
  { name: "Dark SaaS", slug: "dark-saas" },
  { name: "Pastel Playful", slug: "pastel-playful" },
  { name: "Cyberpunk", slug: "cyberpunk" },
  { name: "Neo Brutalism", slug: "neo-brutalism" },
  { name: "Editorial Magazine", slug: "editorial-magazine" },
  { name: "Rounded Soft", slug: "rounded-soft" },
  { name: "Warm Organic", slug: "warm-organic" },
  { name: "Gradient Fusion", slug: "gradient-fusion" },
  { name: "Retro 90s", slug: "retro-90s" },
  { name: "Futuristic UI", slug: "futuristic-ui" },
  { name: "Dashboard Modern", slug: "dashboard-modern" },
  { name: "Mobile First", slug: "mobile-first" },
  { name: "Geometric Tech", slug: "geometric-tech" },
];

// Categories data
const categories = [
  {
    name: "Marketing & Landing",
    slug: "marketing-landing",
    description: "Landing pages, marketing sites, promotional pages",
    icon: "Rocket",
  },
  {
    name: "Product & App UI",
    slug: "product-app-ui",
    description: "Application interfaces, web apps, SaaS products",
    icon: "Smartphone",
  },
  {
    name: "Dashboard & Analytics",
    slug: "dashboard-analytics",
    description: "Admin dashboards, analytics, data visualization",
    icon: "BarChart3",
  },
];

// Subcategories data
const subcategories = [
  // Marketing & Landing
  { name: "SaaS", slug: "saas", categorySlug: "marketing-landing" },
  { name: "Agency", slug: "agency", categorySlug: "marketing-landing" },
  { name: "Personal Brand", slug: "personal-brand", categorySlug: "marketing-landing" },
  { name: "Product Launch", slug: "product-launch", categorySlug: "marketing-landing" },
  { name: "Waitlist", slug: "waitlist", categorySlug: "marketing-landing" },
  { name: "Pricing", slug: "pricing", categorySlug: "marketing-landing" },
  // Product & App UI
  { name: "Auth", slug: "auth", categorySlug: "product-app-ui" },
  { name: "Onboarding", slug: "onboarding", categorySlug: "product-app-ui" },
  { name: "Settings", slug: "settings", categorySlug: "product-app-ui" },
  { name: "Profile", slug: "profile", categorySlug: "product-app-ui" },
  { name: "Feed", slug: "feed", categorySlug: "product-app-ui" },
  { name: "Messaging", slug: "messaging", categorySlug: "product-app-ui" },
  // Dashboard & Analytics
  { name: "Admin", slug: "admin", categorySlug: "dashboard-analytics" },
  { name: "Finance", slug: "finance", categorySlug: "dashboard-analytics" },
  { name: "CRM", slug: "crm", categorySlug: "dashboard-analytics" },
  { name: "Analytics", slug: "analytics", categorySlug: "dashboard-analytics" },
  { name: "KPI Overview", slug: "kpi-overview", categorySlug: "dashboard-analytics" },
  { name: "Ops", slug: "ops", categorySlug: "dashboard-analytics" },
];

// Common tags
const tags = [
  { name: "Responsive", slug: "responsive" },
  { name: "Dark Mode", slug: "dark-mode" },
  { name: "Animations", slug: "animations" },
  { name: "Mobile Ready", slug: "mobile-ready" },
  { name: "SEO Optimized", slug: "seo-optimized" },
  { name: "Fast Loading", slug: "fast-loading" },
  { name: "Accessible", slug: "accessible" },
  { name: "Customizable", slug: "customizable" },
  { name: "Modern Design", slug: "modern-design" },
  { name: "Tailwind CSS", slug: "tailwind-css" },
  { name: "TypeScript", slug: "typescript" },
  { name: "API Ready", slug: "api-ready" },
  { name: "Authentication", slug: "authentication" },
  { name: "Stripe Integration", slug: "stripe-integration" },
  { name: "Multi-language", slug: "multi-language" },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Seed Style Tags
  console.log("📎 Seeding style tags...");
  for (const style of styles) {
    await prisma.styleTag.upsert({
      where: { slug: style.slug },
      update: {},
      create: style,
    });
  }
  console.log(`✅ Seeded ${styles.length} style tags`);

  // Seed Categories
  console.log("📁 Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Seed Subcategories
  console.log("📂 Seeding subcategories...");
  for (const subcategory of subcategories) {
    const category = await prisma.category.findUnique({
      where: { slug: subcategory.categorySlug },
    });

    if (category) {
      await prisma.subcategory.upsert({
        where: { slug: subcategory.slug },
        update: {},
        create: {
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: category.id,
        },
      });
    }
  }
  console.log(`✅ Seeded ${subcategories.length} subcategories`);

  // Seed Tags
  console.log("🏷️ Seeding tags...");
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`✅ Seeded ${tags.length} tags`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
