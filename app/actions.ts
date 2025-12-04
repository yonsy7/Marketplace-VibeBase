"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ZodStringDef, z } from "zod";
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name has to be a min charackter length of 5" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please summerize your product more" }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .min(1, { message: "Pleaes upload a zip of your product" }),
});

const userSettingsSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),

  lastName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),
});

export async function SellProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("something went wrong");
  }

  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productFile: formData.get("productFile"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.product.create({
    data: {
      name: validateFields.data.name,
      category: validateFields.data.category as CategoryTypes,
      price: validateFields.data.price,
      smallDescription: validateFields.data.smallDescription,
      description: validateFields.data.description,
      images: validateFields.data.images,
      productFile: validateFields.data.productFile,
      userId: user.id,
    },
  });

  const state: State = {
    status: "success",
    message: "Your Product has been created",
  };

  return state;
}

export async function UpdateUserSettings(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("something went wrong");
  }

  const validateFields = userSettingsSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: validateFields.data.firstName,
      lastName: validateFields.data.lastName,
    },
  });

  const state: State = {
    status: "success",
    message: "Your Settings have been updated",
  };

  return state;
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smallDescription: true,
      price: true,
      images: true,
      productFile: true,
      userId: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: (data?.price as number) * 100,
          product_data: {
            name: data?.name as string,
            description: data?.smallDescription as string,
            images: data?.images as string[],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      link: data?.productFile as string,
    },
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/success"
        : "https://marshal-ui-yt.vercel.app/payment/success",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/cancel"
        : "https://marshal-ui-yt.vercel.app/payment/cancel",
  });

  return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: data?.connectedAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/stripe/connect"
        : "https://marshal-ui-yt.vercel.app/stripe/connect",
    return_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/stripe/connect"
        : "https://marshal-ui-yt.vercel.app/stripe/connect",
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const loginLink = await stripe.accounts.createLoginLink(
    data?.connectedAccountId as string
  );

  return redirect(loginLink.url);
}

export async function BuyTemplate(formData: FormData) {
  const id = formData.get("id") as string;
  
  const template = await prisma.template.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      shortDesc: true,
      price: true,
      previewImages: true,
      creator: {
        select: {
          connectedAccountId: true,
        },
      },
      files: {
        where: {
          fileType: "PROJECT_ZIP",
        },
        take: 1,
      },
    },
  });

  if (!template) {
    throw new Error("Template not found");
  }

  // Handle free templates
  if (template.price === 0) {
    // Create order directly for free templates
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      throw new Error("Unauthorized");
    }

    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        templateId: template.id,
        paymentIntentId: `free_${Date.now()}`,
        amount: 0,
        platformFee: 0,
        downloadAvailable: true,
      },
    });

    return redirect(`/download/${order.id}`);
  }

  const images =
    template.previewImages &&
    typeof template.previewImages === 'object' &&
    'images' in template.previewImages
      ? (template.previewImages as any).images || []
      : [];

  const downloadUrl = template.files[0]?.fileUrl || '';

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: template.price,
          product_data: {
            name: template.title,
            description: template.shortDesc,
            images: images.slice(0, 1),
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      templateId: template.id,
      link: downloadUrl,
    },
    payment_intent_data: {
      application_fee_amount: Math.round(template.price * 0.1),
      transfer_data: {
        destination: template.creator.connectedAccountId,
      },
    },
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/purchase/success"
        : "https://marshal-ui-yt.vercel.app/purchase/success",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/purchase/cancel"
        : "https://marshal-ui-yt.vercel.app/purchase/cancel",
  });

  return redirect(session.url as string);
}

export async function createTemplate(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Check if user is creator
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== 'CREATOR' && dbUser?.role !== 'ADMIN') {
    throw new Error('Only creators can create templates');
  }

  const title = formData.get('title') as string;
  const byline = formData.get('byline') as string;
  const shortDesc = formData.get('shortDesc') as string;
  const techStack = formData.get('techStack') as string;
  const price = parseInt(formData.get('price') as string) || 0;
  const liveDemoUrl = formData.get('liveDemoUrl') as string;
  const images = JSON.parse(formData.get('images') as string || '[]');
  const styles = JSON.parse(formData.get('styles') as string || '[]');
  const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]');
  const subcategoryIds = JSON.parse(formData.get('subcategoryIds') as string || '[]');
  const tagIds = JSON.parse(formData.get('tagIds') as string || '[]');
  const platforms = JSON.parse(formData.get('platforms') as string || '[]');
  const files = JSON.parse(formData.get('files') as string || '[]');
  const description = formData.get('description') as string;

  // Generate slug
  const { generateUniqueSlug } = await import('@/app/lib/slug');
  const existingSlugs = await prisma.template.findMany({
    select: { slug: true },
  });
  const slug = await generateUniqueSlug(title, existingSlugs.map((t) => t.slug));

  // Find preview file
  const previewFile = files.find((f: any) => f.isPreview);

  // Get style tag IDs
  const styleTagMap = await prisma.styleTag.findMany({
    where: { name: { in: styles } },
    select: { id: true, name: true },
  });
  const styleTagIds = styleTagMap.map((s) => s.id);

  // Create template
  const template = await prisma.template.create({
    data: {
      creatorId: user.id,
      title,
      slug,
      byline: byline || null,
      shortDesc,
      longDesc: description ? JSON.parse(description) : null,
      price,
      techStack: techStack as any,
      status: 'PENDING',
      previewFileId: previewFile?.url || null,
      previewImages: { images },
      liveDemoUrl: liveDemoUrl || null,
      styles: {
        create: styleTagIds.map((styleTagId) => ({
          styleTag: { connect: { id: styleTagId } },
        })),
      },
      categories: {
        create: categoryIds.map((categoryId: string) => ({
          category: { connect: { id: categoryId } },
        })),
      },
      subcategories: {
        create: subcategoryIds.map((subcategoryId: string) => ({
          subcategory: { connect: { id: subcategoryId } },
        })),
      },
      tags: {
        create: tagIds.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      },
      platforms: {
        create: platforms.map((platform: string) => ({
          platform: platform as any,
        })),
      },
      files: {
        create: files.map((file: any) => ({
          fileUrl: file.url,
          fileType: file.type as any,
          fileName: file.name,
          isPreview: file.isPreview || false,
        })),
      },
    },
  });

  // Generate and store embedding asynchronously (don't block response)
  if (process.env.OPENAI_API_KEY) {
    import('@/app/lib/embeddings')
      .then(({ generateAndStoreEmbedding }) => generateAndStoreEmbedding(template.id))
      .catch((error) => console.error('Error generating embedding:', error));
  }

  return {
    status: 'success' as const,
    message: 'Template created successfully!',
    templateId: template.id,
  };
}

export async function updateTemplate(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: 'error' as const,
      message: 'Unauthorized',
    };
  }

  const templateId = formData.get('templateId') as string;
  if (!templateId) {
    return {
      status: 'error' as const,
      message: 'Template ID is required',
    };
  }

  // Verify ownership
  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateId },
    select: { creatorId: true, status: true },
  });

  if (!existingTemplate) {
    return {
      status: 'error' as const,
      message: 'Template not found',
    };
  }

  if (existingTemplate.creatorId !== user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (dbUser?.role !== 'ADMIN') {
      return {
        status: 'error' as const,
        message: 'Unauthorized',
      };
    }
  }

  const title = formData.get('title') as string;
  const byline = formData.get('byline') as string;
  const shortDesc = formData.get('shortDesc') as string;
  const techStack = formData.get('techStack') as string;
  const price = parseInt(formData.get('price') as string) || 0;
  const liveDemoUrl = formData.get('liveDemoUrl') as string;
  const images = JSON.parse(formData.get('images') as string || '[]');
  const styles = JSON.parse(formData.get('styles') as string || '[]');
  const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]');
  const subcategoryIds = JSON.parse(formData.get('subcategoryIds') as string || '[]');
  const tagIds = JSON.parse(formData.get('tagIds') as string || '[]');
  const platforms = JSON.parse(formData.get('platforms') as string || '[]');
  const files = JSON.parse(formData.get('files') as string || '[]');
  const description = formData.get('description') as string;

  // Generate new slug if title changed
  const existingTemplateFull = await prisma.template.findUnique({
    where: { id: templateId },
    select: { title: true, slug: true },
  });

  let slug = existingTemplateFull?.slug || '';
  if (existingTemplateFull?.title !== title) {
    const { generateUniqueSlug } = await import('@/app/lib/slug');
    const existingSlugs = await prisma.template.findMany({
      where: { id: { not: templateId } },
      select: { slug: true },
    });
    slug = await generateUniqueSlug(title, existingSlugs.map((t) => t.slug));
  }

  // Find preview file
  const previewFile = files.find((f: any) => f.isPreview);

  // Get style tag IDs
  const styleTagMap = await prisma.styleTag.findMany({
    where: { name: { in: styles } },
    select: { id: true, name: true },
  });
  const styleTagIds = styleTagMap.map((s) => s.id);

  // Determine new status
  let newStatus = existingTemplate.status;
  if (existingTemplate.status === 'PUBLISHED') {
    newStatus = 'PENDING'; // Require re-approval if published template is modified
  }

  // Update template
  const template = await prisma.template.update({
    where: { id: templateId },
    data: {
      title,
      slug,
      byline: byline || null,
      shortDesc,
      longDesc: description ? JSON.parse(description) : null,
      price,
      techStack: techStack as any,
      status: newStatus,
      previewFileId: previewFile?.url || null,
      previewImages: { images },
      liveDemoUrl: liveDemoUrl || null,
    },
  });

  // Delete and recreate relations
  await Promise.all([
    prisma.templateStyleTag.deleteMany({ where: { templateId } }),
    prisma.templateCategory.deleteMany({ where: { templateId } }),
    prisma.templateSubcategory.deleteMany({ where: { templateId } }),
    prisma.templateTag.deleteMany({ where: { templateId } }),
    prisma.templatePlatform.deleteMany({ where: { templateId } }),
    prisma.templateFile.deleteMany({ where: { templateId } }),
  ]);

  // Recreate relations
  await Promise.all([
    prisma.templateStyleTag.createMany({
      data: styleTagIds.map((styleTagId) => ({
        templateId: template.id,
        styleTagId,
      })),
    }),
    prisma.templateCategory.createMany({
      data: categoryIds.map((categoryId: string) => ({
        templateId: template.id,
        categoryId,
      })),
    }),
    prisma.templateSubcategory.createMany({
      data: subcategoryIds.map((subcategoryId: string) => ({
        templateId: template.id,
        subcategoryId,
      })),
    }),
    prisma.templateTag.createMany({
      data: tagIds.map((tagId: string) => ({
        templateId: template.id,
        tagId,
      })),
    }),
    prisma.templatePlatform.createMany({
      data: platforms.map((platform: string) => ({
        templateId: template.id,
        platform: platform as any,
      })),
    }),
    prisma.templateFile.createMany({
      data: files.map((file: any) => ({
        templateId: template.id,
        fileUrl: file.url,
        fileType: file.type as any,
        fileName: file.name,
        isPreview: file.isPreview || false,
      })),
    }),
  ]);

  // Regenerate embedding asynchronously if OpenAI is available
  if (process.env.OPENAI_API_KEY) {
    import('@/app/lib/embeddings')
      .then(({ generateAndStoreEmbedding }) => generateAndStoreEmbedding(template.id))
      .catch((error) => console.error('Error regenerating embedding:', error));
  }

  return {
    status: 'success' as const,
    message: 'Template updated successfully!',
    templateId: template.id,
  };
}

export async function deleteTemplate(templateId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // Verify ownership
  if (template.creatorId !== user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (dbUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  // Check if template has sales
  if (template._count.orders > 0) {
    throw new Error('Cannot delete template with existing sales');
  }

  // Delete template (cascade will handle relations, embedding will be deleted with template)
  await prisma.template.delete({
    where: { id: templateId },
  });

  return { success: true };
}

export async function updateProfile(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: 'error' as const,
      message: 'Unauthorized',
    };
  }

  const userId = formData.get('userId') as string;
  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string;
  const avatarUrl = formData.get('avatarUrl') as string;

  // Verify ownership
  if (userId !== user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (dbUser?.role !== 'ADMIN') {
      return {
        status: 'error' as const,
        message: 'Unauthorized',
      };
    }
  }

  // Validate username format
  if (!/^[a-z0-9-]+$/.test(username)) {
    return {
      status: 'error' as const,
      message: 'Username can only contain lowercase letters, numbers, and hyphens',
    };
  }

  // Check username uniqueness
  const existingUser = await prisma.user.findFirst({
    where: {
      username: username,
      id: { not: userId },
    },
  });

  if (existingUser) {
    return {
      status: 'error' as const,
      message: 'Username already taken',
    };
  }

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
    },
  });

  return {
    status: 'success' as const,
    message: 'Profile updated successfully!',
  };
}
