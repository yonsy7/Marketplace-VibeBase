import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from './app/lib/db';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques - pas de vérification
  const publicRoutes = [
    '/',
    '/templates',
    '/api/auth',
    '/api/uploadthing',
    '/api/templates',
    '/api/ai',
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Routes protégées - nécessitent authentification
  const protectedRoutes = ['/creator', '/admin', '/user', '/download', '/purchase'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérifier le rôle pour les routes admin
    if (pathname.startsWith('/admin')) {
      const user = await prisma.user.findUnique({
        where: { id: kindeUser.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Vérifier le rôle pour les routes creator
    if (pathname.startsWith('/creator') && !pathname.startsWith('/creator/[')) {
      // Exclure les routes publiques comme /creator/[username]
      const user = await prisma.user.findUnique({
        where: { id: kindeUser.id },
        select: { role: true },
      });

      if (user?.role !== 'CREATOR' && user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
