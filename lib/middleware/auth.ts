import { getSession } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

/**
 * Verify user is authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

/**
 * Require specific role(s)
 */
export async function requireRole(allowedRoles: UserRole[] | UserRole) {
  const session = await requireAuth();
  if (!session) {
    return null;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(session.role)) {
    return null;
  }

  return session;
}

/**
 * Require customer role
 */
export async function requireCustomer() {
  const session = await requireAuth();
  if (!session || session.role !== "CUSTOMER") {
    return null;
  }
  return session;
}

/**
 * Require admin role (any admin level)
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session || !["ADMIN1", "ADMIN2", "ADMIN3", "SUPERADMIN"].includes(session.role)) {
    return null;
  }
  return session;
}

/**
 * Require specific admin level
 */
export async function requireAdminLevel(level: "ADMIN1" | "ADMIN2" | "ADMIN3" | "SUPERADMIN") {
  const session = await requireAuth();
  if (!session || session.role !== level) {
    return null;
  }
  return session;
}

/**
 * Require superadmin role
 */
export async function requireSuperAdmin() {
  const session = await requireAuth();
  if (!session || session.role !== "SUPERADMIN") {
    return null;
  }
  return session;
}
