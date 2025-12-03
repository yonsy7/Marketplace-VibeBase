"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import prisma from "./lib/db";
import { type CategoryTypes, type TechStack } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";
import { generateSlug } from "./lib/classification";

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

// Legacy product schema
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

// New template schema
const templateSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, { message: "Title must be less than 50 characters" }),
  byline: z
    .string()
    .max(80, { message: "Byline must be less than 80 characters" })
    .optional(),
  shortDesc: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(260, { message: "Description must be less than 260 characters" }),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  techStack: z.enum(["HTML", "REACT_VITE", "NEXTJS"]),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string()).min(2, { message: "At least 2 images required" }),
  productFile: z.string().min(1, { message: "Template file is required" }),
  styles: z.array(z.string()).max(5, { message: "Maximum 5 styles allowed" }),
  categories: z.array(z.string()).max(3, { message: "Maximum 3 categories" }),
  subcategories: z.array(z.string()).max(6, { message: "Maximum 6 subcategories" }),
  tags: z.array(z.string()),
  platforms: z.array(z.string()),
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
    throw new Error("Something went wrong");
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
      smallDescription: validateFields.data.smallDescription,
      price: validateFields.data.price,
      images: validateFields.data.images,
      productFile: validateFields.data.productFile,
      userId: user.id,
      description: JSON.parse(validateFields.data.description),
    },
  });

  return redirect(`/product/${data.id}`);
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
      User: {
        select: {
          connectedAccountId: true,
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.smallDescription,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      link: data?.productFile as string,
    },

    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
      transfer_data: {
        destination: data?.User?.connectedAccountId as string,
      },
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
    throw new Error();
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
        ? `http://localhost:3000/billing`
        : `https://marshal-ui-yt.vercel.app/billing`,
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${data?.connectedAccountId}`
        : `https://marshal-ui-yt.vercel.app/return/${data?.connectedAccountId}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error();
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

// ===== NEW TEMPLATE ACTIONS =====

export async function CreateTemplate(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    byline: formData.get("byline") as string || undefined,
    shortDesc: formData.get("shortDesc") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price") || 0) * 100, // Convert to cents
    techStack: formData.get("techStack") as string,
    liveDemoUrl: formData.get("liveDemoUrl") as string || undefined,
    images: JSON.parse(formData.get("images") as string || "[]"),
    productFile: formData.get("productFile") as string,
    styles: JSON.parse(formData.get("styles") as string || "[]"),
    categories: JSON.parse(formData.get("categories") as string || "[]"),
    subcategories: JSON.parse(formData.get("subcategories") as string || "[]"),
    tags: JSON.parse(formData.get("tags") as string || "[]"),
    platforms: JSON.parse(formData.get("platforms") as string || "[]"),
  };

  // Validate
  const validateFields = templateSchema.safeParse(rawData);

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Please check your inputs and try again.",
    };
    return state;
  }

  const data = validateFields.data;

  // Generate unique slug
  let slug = generateSlug(data.title);
  let slugExists = await prisma.template.findUnique({ where: { slug } });
  let counter = 1;
  while (slugExists) {
    slug = `${generateSlug(data.title)}-${counter}`;
    slugExists = await prisma.template.findUnique({ where: { slug } });
    counter++;
  }

  try {
    // Create template
    const template = await prisma.template.create({
      data: {
        creatorId: user.id,
        title: data.title,
        slug,
        byline: data.byline,
        shortDesc: data.shortDesc,
        longDesc: data.description,
        price: data.price,
        techStack: data.techStack as TechStack,
        liveDemoUrl: data.liveDemoUrl,
        previewImages: data.images,
        status: "PENDING", // Submitted for review
        files: {
          create: {
            fileUrl: data.productFile,
            fileType: data.techStack === "HTML" ? "HTML" : "PROJECT_ZIP",
            fileName: "template-files",
          },
        },
        styles: {
          create: data.styles.map((styleId: string) => ({
            styleId,
          })),
        },
        categories: {
          create: data.categories.map((categoryId: string) => ({
            categoryId,
          })),
        },
        subcategories: {
          create: data.subcategories.map((subcategoryId: string) => ({
            subcategoryId,
          })),
        },
        tags: {
          create: data.tags.map((tagId: string) => ({
            tagId,
          })),
        },
        platforms: {
          create: data.platforms.map((platform: string) => ({
            platform: platform as any,
          })),
        },
      },
    });

    return redirect(`/templates/${template.slug}`);
  } catch (error) {
    console.error("Error creating template:", error);
    const state: State = {
      status: "error",
      message: "Failed to create template. Please try again.",
    };
    return state;
  }
}

export async function UpdateTemplate(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const templateId = formData.get("templateId") as string;

  // Verify ownership
  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!existingTemplate || existingTemplate.creatorId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Parse and validate (similar to CreateTemplate)
  const rawData = {
    title: formData.get("title") as string,
    byline: formData.get("byline") as string || undefined,
    shortDesc: formData.get("shortDesc") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price") || 0) * 100,
    techStack: formData.get("techStack") as string,
    liveDemoUrl: formData.get("liveDemoUrl") as string || undefined,
    images: JSON.parse(formData.get("images") as string || "[]"),
    productFile: formData.get("productFile") as string,
    styles: JSON.parse(formData.get("styles") as string || "[]"),
    categories: JSON.parse(formData.get("categories") as string || "[]"),
    subcategories: JSON.parse(formData.get("subcategories") as string || "[]"),
    tags: JSON.parse(formData.get("tags") as string || "[]"),
    platforms: JSON.parse(formData.get("platforms") as string || "[]"),
  };

  const validateFields = templateSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      status: "error" as const,
      errors: validateFields.error.flatten().fieldErrors,
      message: "Please check your inputs.",
    };
  }

  const data = validateFields.data;

  try {
    // Delete existing relations
    await prisma.templateStyleTag.deleteMany({ where: { templateId } });
    await prisma.templateCategory.deleteMany({ where: { templateId } });
    await prisma.templateSubcategory.deleteMany({ where: { templateId } });
    await prisma.templateTag.deleteMany({ where: { templateId } });
    await prisma.templatePlatform.deleteMany({ where: { templateId } });

    // Update template
    await prisma.template.update({
      where: { id: templateId },
      data: {
        title: data.title,
        byline: data.byline,
        shortDesc: data.shortDesc,
        longDesc: data.description,
        price: data.price,
        techStack: data.techStack as TechStack,
        liveDemoUrl: data.liveDemoUrl,
        previewImages: data.images,
        status: existingTemplate.status === "PUBLISHED" ? "PENDING" : existingTemplate.status,
        styles: {
          create: data.styles.map((styleId: string) => ({ styleId })),
        },
        categories: {
          create: data.categories.map((categoryId: string) => ({ categoryId })),
        },
        subcategories: {
          create: data.subcategories.map((subcategoryId: string) => ({ subcategoryId })),
        },
        tags: {
          create: data.tags.map((tagId: string) => ({ tagId })),
        },
        platforms: {
          create: data.platforms.map((platform: string) => ({
            platform: platform as any,
          })),
        },
      },
    });

    return {
      status: "success" as const,
      message: "Template updated successfully!",
    };
  } catch (error) {
    console.error("Error updating template:", error);
    return {
      status: "error" as const,
      message: "Failed to update template.",
    };
  }
}

export async function DeleteTemplate(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const templateId = formData.get("templateId") as string;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { orders: true },
  });

  if (!template || template.creatorId !== user.id) {
    throw new Error("Unauthorized");
  }

  if (template.orders.length > 0) {
    throw new Error("Cannot delete template with existing orders");
  }

  await prisma.template.delete({
    where: { id: templateId },
  });

  return redirect("/creator/dashboard");
}

// Toggle favorite
export async function ToggleFavorite(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return { error: "Please sign in to favorite templates" };
  }

  const templateId = formData.get("templateId") as string;

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      templateId_userId: {
        templateId,
        userId: user.id,
      },
    },
  });

  if (existingFavorite) {
    // Remove favorite
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });
    await prisma.template.update({
      where: { id: templateId },
      data: { likeCount: { decrement: 1 } },
    });
    return { success: true, isFavorited: false };
  } else {
    // Add favorite
    await prisma.favorite.create({
      data: {
        templateId,
        userId: user.id,
      },
    });
    await prisma.template.update({
      where: { id: templateId },
      data: { likeCount: { increment: 1 } },
    });
    return { success: true, isFavorited: true };
  }
}
