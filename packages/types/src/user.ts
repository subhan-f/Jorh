import { z } from "zod";

export type Plan = "free" | "pro" | "business" | "enterprise";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";
export type UserRole = "client" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionEndsAt?: Date;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const PLAN_LIMITS = {
  free: { links: 50, bioPages: 1, customDomains: 0, customSlugs: 3, analyticsRetentionDays: 30 },
  pro: {
    links: Infinity,
    bioPages: 5,
    customDomains: 3,
    customSlugs: Infinity,
    analyticsRetentionDays: 365,
  },
  business: {
    links: Infinity,
    bioPages: Infinity,
    customDomains: 10,
    customSlugs: Infinity,
    analyticsRetentionDays: 1095,
  },
  enterprise: {
    links: Infinity,
    bioPages: Infinity,
    customDomains: Infinity,
    customSlugs: Infinity,
    analyticsRetentionDays: Infinity,
  },
} as const satisfies Record<
  Plan,
  {
    links: number;
    bioPages: number;
    customDomains: number;
    customSlugs: number;
    analyticsRetentionDays: number;
  }
>;
