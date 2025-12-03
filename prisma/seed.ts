import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // SEED STYLES (14 styles)
  // ============================================
  console.log('📝 Seeding styles...');
  const styles = [
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
  ];

  for (const styleName of styles) {
    await prisma.styleTag.upsert({
      where: { name: styleName },
      update: {},
      create: { name: styleName },
    });
  }
  console.log(`✅ Seeded ${styles.length} styles`);

  // ============================================
  // SEED CATEGORIES (3 categories)
  // ============================================
  console.log('📝 Seeding categories...');
  const categories = [
    {
      name: 'Marketing & Landing',
      description: 'Landing pages, marketing sites',
      icon: '🚀',
    },
    {
      name: 'Product & App UI',
      description: 'Application interfaces',
      icon: '📱',
    },
    {
      name: 'Dashboard & Analytics',
      description: 'Dashboards, analytics',
      icon: '📊',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
    });
    createdCategories.push(created);
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // ============================================
  // SEED SUBCATEGORIES
  // ============================================
  console.log('📝 Seeding subcategories...');
  
  const marketingSubcategories = [
    'SaaS',
    'Agency',
    'Personal brand',
    'Product launch',
    'Waitlist',
    'Pricing',
  ];

  const productSubcategories = [
    'Auth',
    'Onboarding',
    'Settings',
    'Profile',
    'Feed',
    'Messaging',
  ];

  const dashboardSubcategories = [
    'Admin',
    'Finance',
    'CRM',
    'Analytics',
    'KPI Overview',
    'Ops',
  ];

  const marketingCategory = createdCategories.find(c => c.name === 'Marketing & Landing');
  const productCategory = createdCategories.find(c => c.name === 'Product & App UI');
  const dashboardCategory = createdCategories.find(c => c.name === 'Dashboard & Analytics');

  if (marketingCategory) {
    for (const subName of marketingSubcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: marketingCategory.id,
            name: subName,
          },
        },
        update: {},
        create: {
          categoryId: marketingCategory.id,
          name: subName,
        },
      });
    }
  }

  if (productCategory) {
    for (const subName of productSubcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: productCategory.id,
            name: subName,
          },
        },
        update: {},
        create: {
          categoryId: productCategory.id,
          name: subName,
        },
      });
    }
  }

  if (dashboardCategory) {
    for (const subName of dashboardSubcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: dashboardCategory.id,
            name: subName,
          },
        },
        update: {},
        create: {
          categoryId: dashboardCategory.id,
          name: subName,
        },
      });
    }
  }

  const totalSubcategories = 
    marketingSubcategories.length + 
    productSubcategories.length + 
    dashboardSubcategories.length;
  console.log(`✅ Seeded ${totalSubcategories} subcategories`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
