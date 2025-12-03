import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { UserRole } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin - nécessitent le rôle ADMIN
  if (pathname.startsWith("/admin")) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Routes créateur - nécessitent le rôle CREATOR
  if (pathname.startsWith("/creator")) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== UserRole.CREATOR && dbUser.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Routes utilisateur - nécessitent une authentification
  if (pathname.startsWith("/user")) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/creator/:path*",
    "/user/:path*",
  ],
};
