/**
 * Script to generate embeddings for all existing templates
 * 
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' app/scripts/generate-embeddings.ts
 * 
 * Or add to package.json:
 *   "generate-embeddings": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' app/scripts/generate-embeddings.ts"
 */

import prisma from '../lib/db';
import { generateAndStoreEmbedding } from '../lib/embeddings';

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set. Cannot generate embeddings.');
    process.exit(1);
  }

  console.log('🚀 Starting embedding generation for all templates...\n');

  // Fetch all published templates
  const templates = await prisma.template.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  console.log(`📊 Found ${templates.length} templates to process\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const progress = `[${i + 1}/${templates.length}]`;

    try {
      console.log(`${progress} Generating embedding for: ${template.title} (${template.slug})`);
      await generateAndStoreEmbedding(template.id);
      successCount++;
      console.log(`✅ Success\n`);
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Error: ${error.message}\n`);
    }

    // Small delay to avoid rate limiting
    if (i < templates.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log('\n📈 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${templates.length}`);
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
