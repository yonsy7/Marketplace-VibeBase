import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed StyleTags
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

  console.log('📝 Seeding styles...');
  for (const styleName of styles) {
    await prisma.styleTag.upsert({
      where: { name: styleName },
      update: {},
      create: { name: styleName },
    });
  }
  console.log(`✅ Seeded ${styles.length} styles`);

  // Seed Categories
  const categories = [
    {
      name: 'Marketing & Landing',
      description: 'Landing pages, marketing sites',
      icon: '🚀',
      subcategories: [
        'SaaS',
        'Agency',
        'Personal brand',
        'Product launch',
        'Waitlist',
        'Pricing',
      ],
    },
    {
      name: 'Product & App UI',
      description: 'Application interfaces',
      icon: '📱',
      subcategories: [
        'Auth',
        'Onboarding',
        'Settings',
        'Profile',
        'Feed',
        'Messaging',
      ],
    },
    {
      name: 'Dashboard & Analytics',
      description: 'Dashboards, analytics',
      icon: '📊',
      subcategories: [
        'Admin',
        'Finance',
        'CRM',
        'Analytics',
        'KPI Overview',
        'Ops',
      ],
    },
  ];

  console.log('📝 Seeding categories and subcategories...');
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
      },
    });

    for (const subcatName of categoryData.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: subcatName,
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          name: subcatName,
        },
      });
    }
  }
  console.log(`✅ Seeded ${categories.length} categories with subcategories`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
