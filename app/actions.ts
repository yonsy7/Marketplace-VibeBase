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
