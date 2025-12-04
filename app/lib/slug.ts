import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a title
 * Ensures uniqueness by appending a random string if needed
 */
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Generate a unique slug by checking against existing slugs
 */
export async function generateUniqueSlug(
  title: string,
  existingSlugs: string[],
  maxAttempts: number = 10
): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let attempt = 0;

  while (existingSlugs.includes(slug) && attempt < maxAttempts) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  if (attempt >= maxAttempts) {
    // Fallback: append timestamp
    slug = `${baseSlug}-${Date.now()}`;
  }

  return slug;
}
