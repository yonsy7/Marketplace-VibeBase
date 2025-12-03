"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import { TemplateStatus, TechStack, PlatformType, FileType } from "@prisma/client";
import { generateSlug } from "@/app/lib/classification";

export type TemplateState = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const templateSchema = z.object({
  title: z.string().min(3).max(50),
  byline: z.string().max(80).optional(),
  shortDesc: z.string().min(10).max(260),
  longDesc: z.string().optional(),
  price: z.number().min(0),
  techStack: z.enum(["HTML", "REACT_VITE", "NEXTJS"]),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  previewImages: z.array(z.string()).min(2).max(4),
  styles: z.array(z.string()).max(5),
  categories: z.array(z.string()).max(3),
  subcategories: z.array(z.string()).max(6),
  tags: z.array(z.string()).max(20),
  platforms: z.array(z.string()),
  files: z.array(z.object({
    fileUrl: z.string(),
    fileName: z.string(),
    fileType: z.enum(["HTML", "PROJECT_ZIP", "CSS", "JS", "ASSET"]),
    fileSize: z.number().optional(),
    isPreview: z.boolean().optional(),
  })),
  previewFileId: z.string().optional(),
});

export async function createTemplate(
  prevState: TemplateState,
  formData: FormData
): Promise<TemplateState> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be logged in to create a template",
    };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title"),
    byline: formData.get("byline") || undefined,
    shortDesc: formData.get("shortDesc"),
    longDesc: formData.get("longDesc") || undefined,
    price: Number(formData.get("price")),
    techStack: formData.get("techStack"),
    liveDemoUrl: formData.get("liveDemoUrl") || undefined,
    previewImages: JSON.parse(formData.get("previewImages") as string),
    styles: JSON.parse(formData.get("styles") as string),
    categories: JSON.parse(formData.get("categories") as string),
    subcategories: JSON.parse(formData.get("subcategories") as string),
    tags: JSON.parse(formData.get("tags") as string),
    platforms: JSON.parse(formData.get("platforms") as string),
    files: JSON.parse(formData.get("files") as string),
    previewFileId: formData.get("previewFileId") || undefined,
  };

  const validateFields = templateSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Please check your inputs",
    };
  }

  const data = validateFields.data;
  const slug = generateSlug(data.title);

  // Check if slug already exists
  const existingTemplate = await prisma.template.findUnique({
    where: { slug },
  });

  if (existingTemplate) {
    return {
      status: "error",
      message: "A template with this title already exists",
    };
  }

  // Get or create style tags
  const styleTags = await Promise.all(
    data.styles.map(async (styleName) => {
      return prisma.styleTag.upsert({
        where: { name: styleName },
        update: {},
        create: { name: styleName },
      });
    })
  );

  // Get or create categories
  const categories = await Promise.all(
    data.categories.map(async (categoryName) => {
      return prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
    })
  );

  // Get subcategories
  const subcategories = await Promise.all(
    data.subcategories.map(async (subcategoryName) => {
      // Find subcategory by name (we need to search across all categories)
      const subcategory = await prisma.subcategory.findFirst({
        where: { name: subcategoryName },
      });
      if (!subcategory) {
        throw new Error(`Subcategory ${subcategoryName} not found`);
      }
      return subcategory;
    })
  );

  // Get or create tags
  const tags = await Promise.all(
    data.tags.map(async (tagName) => {
      return prisma.tag.upsert({
        where: { name: tagName.toLowerCase() },
        update: {},
        create: { name: tagName.toLowerCase() },
      });
    })
  );

  // Create template with relations
  const template = await prisma.template.create({
    data: {
      creatorId: user.id,
      title: data.title,
      slug,
      byline: data.byline,
      shortDesc: data.shortDesc,
      longDesc: data.longDesc,
      price: data.price,
      techStack: data.techStack as TechStack,
      liveDemoUrl: data.liveDemoUrl,
      previewImages: data.previewImages,
      previewFileId: data.previewFileId,
      status: TemplateStatus.DRAFT,
      styles: {
        create: styleTags.map((tag) => ({
          styleTagId: tag.id,
        })),
      },
      categories: {
        create: categories.map((cat) => ({
          categoryId: cat.id,
        })),
      },
      subcategories: {
        create: subcategories.map((sub) => ({
          subcategoryId: sub.id,
        })),
      },
      tags: {
        create: tags.map((tag) => ({
          tagId: tag.id,
        })),
      },
      platforms: {
        create: data.platforms.map((platform) => ({
          platform: platform as PlatformType,
        })),
      },
      files: {
        create: data.files.map((file) => ({
          fileUrl: file.fileUrl,
          fileName: file.fileName,
          fileType: file.fileType as FileType,
          fileSize: file.fileSize,
          isPreview: file.isPreview || false,
        })),
      },
    },
  });

  return redirect(`/creator/templates/${template.id}/edit`);
}

export async function updateTemplate(
  templateId: string,
  prevState: TemplateState,
  formData: FormData
): Promise<TemplateState> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be logged in",
    };
  }

  // Verify ownership
  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateId },
    select: { creatorId: true, status: true },
  });

  if (!existingTemplate || existingTemplate.creatorId !== user.id) {
    return {
      status: "error",
      message: "You don't have permission to edit this template",
    };
  }

  // Parse and validate (same as create)
  const rawData = {
    title: formData.get("title"),
    byline: formData.get("byline") || undefined,
    shortDesc: formData.get("shortDesc"),
    longDesc: formData.get("longDesc") || undefined,
    price: Number(formData.get("price")),
    techStack: formData.get("techStack"),
    liveDemoUrl: formData.get("liveDemoUrl") || undefined,
    previewImages: JSON.parse(formData.get("previewImages") as string),
    styles: JSON.parse(formData.get("styles") as string),
    categories: JSON.parse(formData.get("categories") as string),
    subcategories: JSON.parse(formData.get("subcategories") as string),
    tags: JSON.parse(formData.get("tags") as string),
    platforms: JSON.parse(formData.get("platforms") as string),
    files: JSON.parse(formData.get("files") as string),
    previewFileId: formData.get("previewFileId") || undefined,
  };

  const validateFields = templateSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Please check your inputs",
    };
  }

  const data = validateFields.data;
  const slug = generateSlug(data.title);

  // Check slug uniqueness (excluding current template)
  const slugConflict = await prisma.template.findFirst({
    where: {
      slug,
      id: { not: templateId },
    },
  });

  if (slugConflict) {
    return {
      status: "error",
      message: "A template with this title already exists",
    };
  }

  // Determine new status
  let newStatus = existingTemplate.status;
  if (existingTemplate.status === TemplateStatus.PUBLISHED) {
    // If published template is edited, set to pending for review
    newStatus = TemplateStatus.PENDING;
  }

  // Update template (simplified - in production, handle relations update more carefully)
  await prisma.template.update({
    where: { id: templateId },
    data: {
      title: data.title,
      slug,
      byline: data.byline,
      shortDesc: data.shortDesc,
      longDesc: data.longDesc,
      price: data.price,
      techStack: data.techStack as TechStack,
      liveDemoUrl: data.liveDemoUrl,
      previewImages: data.previewImages,
      previewFileId: data.previewFileId,
      status: newStatus,
    },
  });

  return {
    status: "success",
    message: "Template updated successfully",
  };
}

export async function submitTemplateForReview(templateId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { creatorId: true },
  });

  if (!template || template.creatorId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.template.update({
    where: { id: templateId },
    data: { status: TemplateStatus.PENDING },
  });

  return { success: true };
}

export async function deleteTemplate(templateId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { creatorId: true, orders: { take: 1 } },
  });

  if (!template || template.creatorId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Check if template has orders
  if (template.orders.length > 0) {
    throw new Error("Cannot delete template with existing orders");
  }

  await prisma.template.delete({
    where: { id: templateId },
  });

  return { success: true };
}
