import type { UserRole } from "@jorh/types";

export function getRoleBasePath(role: UserRole): string {
  return role === "admin" ? "/admin" : "/client";
}

export function getRoleDashboardPath(role: UserRole): string {
  return `${getRoleBasePath(role)}/dashboard`;
}

export function withRolePath(role: UserRole, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getRoleBasePath(role)}${normalized}`;
}
