import { z } from "zod";

export type LinkType = "short" | "whatsapp" | "qr" | "rotator";

export interface Link {
  id: string;
  ownerId: string;
  workspaceId?: string;
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  title?: string;
  tags: string[];
  type: LinkType;
  password?: string;
  expiresAt?: Date;
  clickLimit?: number;
  clickCount: number;
  isActive: boolean;
  isDeleted: boolean;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url("Must be a valid URL"),
  customSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be at most 30 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens allowed")
    .optional(),
  title: z.string().max(100).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  type: z.enum(["short", "whatsapp", "qr", "rotator"]).default("short"),
  password: z.string().min(4).max(50).optional(),
  expiresAt: z.string().datetime().optional(),
  clickLimit: z.number().int().positive().optional(),
});

export const UpdateLinkSchema = CreateLinkSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
