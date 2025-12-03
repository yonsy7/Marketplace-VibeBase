import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import prisma from "@/app/lib/db";

export async function getCurrentUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login");
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== role) {
    redirect("/");
  }

  return { user, dbUser };
}

export async function requireCreator() {
  return requireRole(UserRole.CREATOR);
}

export async function requireAdmin() {
  return requireRole(UserRole.ADMIN);
}

export async function getUserRole(userId: string): Promise<UserRole> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role || UserRole.USER;
}
