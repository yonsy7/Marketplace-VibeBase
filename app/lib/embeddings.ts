import prisma from '@/app/lib/db';
import { generateEmbedding } from '@/app/lib/openai';

/**
 * Generate embedding text from a template
 * Concatenates: title, shortDesc, styles, categories, tags, techStack, platforms
 */
export async function generateTemplateEmbeddingText(template: {
  title: string;
  shortDesc: string;
  byline?: string | null;
  techStack: string;
  styles?: Array<{ styleTag: { name: string } }>;
  categories?: Array<{ category: { name: string } }>;
  tags?: Array<{ tag: { name: string } }>;
  platforms?: Array<{ platform: string }>;
}): Promise<string> {
  const parts: string[] = [];

  // Title and description
  parts.push(template.title);
  if (template.byline) parts.push(template.byline);
  parts.push(template.shortDesc);

  // Tech stack
  parts.push(`Tech stack: ${template.techStack}`);

  // Styles
  if (template.styles && template.styles.length > 0) {
    const styleNames = template.styles.map((s) => s.styleTag.name).join(', ');
    parts.push(`Styles: ${styleNames}`);
  }

  // Categories
  if (template.categories && template.categories.length > 0) {
    const categoryNames = template.categories.map((c) => c.category.name).join(', ');
    parts.push(`Categories: ${categoryNames}`);
  }

  // Tags
  if (template.tags && template.tags.length > 0) {
    const tagNames = template.tags.map((t) => t.tag.name).join(', ');
    parts.push(`Tags: ${tagNames}`);
  }

  // Platforms
  if (template.platforms && template.platforms.length > 0) {
    const platformNames = template.platforms.map((p) => p.platform).join(', ');
    parts.push(`AI Platforms: ${platformNames}`);
  }

  return parts.join('. ');
}

/**
 * Generate and store embedding for a template
 */
export async function generateAndStoreEmbedding(templateId: string): Promise<void> {
  // Fetch template with all relations
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      styles: {
        include: {
          styleTag: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      platforms: true,
    },
  });

  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Generate embedding text
  const embeddingText = await generateTemplateEmbeddingText(template);

  // Generate embedding vector
  const embedding = await generateEmbedding(embeddingText);

  // Store embedding in database
  await prisma.template.update({
    where: { id: templateId },
    data: {
      embedding: embedding as any, // Store as JSON
    },
  });
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Find similar templates using vector similarity
 */
export async function findSimilarTemplates(
  queryEmbedding: number[],
  limit: number = 6,
  excludeTemplateId?: string
): Promise<Array<{ template: any; similarity: number }>> {
  // Fetch all templates with embeddings
  const templates = await prisma.template.findMany({
    where: {
      status: 'PUBLISHED',
      embedding: { not: null },
      ...(excludeTemplateId ? { id: { not: excludeTemplateId } } : {}),
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          profileImage: true,
        },
      },
      styles: {
        include: {
          styleTag: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      platforms: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  // Calculate similarities
  const results = templates
    .map((template) => {
      if (!template.embedding || typeof template.embedding !== 'object') {
        return null;
      }

      const templateEmbedding = Array.isArray(template.embedding)
        ? template.embedding
        : Object.values(template.embedding as Record<string, number>);

      const similarity = cosineSimilarity(queryEmbedding, templateEmbedding);

      return {
        template,
        similarity,
      };
    })
    .filter((r): r is { template: any; similarity: number } => r !== null)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}
