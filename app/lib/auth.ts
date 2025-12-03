import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import prisma from './db';

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: kindeUser.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      role: true,
      avatarUrl: true,
      profileImage: true,
    },
  });

  return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/api/auth/login');
  }
  return user;
}

/**
 * Require a specific role - redirects if user doesn't have the role
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect('/');
  }
  return user;
}

/**
 * Require creator role
 */
export async function requireCreator() {
  return requireRole('CREATOR');
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole('ADMIN');
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is a creator
 */
export async function isCreator(): Promise<boolean> {
  return hasRole('CREATOR');
}

/**
 * Check if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN');
}

/**
 * Check if user owns a resource (by creatorId)
 */
export async function ownsResource(creatorId: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.id === creatorId;
}
