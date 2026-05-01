import { z } from "zod";

export type ButtonStyle = "rounded" | "pill" | "square";

export interface BioButton {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
  clickCount: number;
}

export interface BioTheme {
  background: string;
  cardBackground: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  buttonStyle: ButtonStyle;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface BioPage {
  id: string;
  ownerId: string;
  slug: string;
  customDomain?: string;
  title: string;
  description?: string;
  avatarUrl?: string;
  theme: BioTheme;
  buttons: BioButton[];
  socialLinks: SocialLink[];
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const BioButtonSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(60),
  url: z.string().url(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0),
  clickCount: z.number().int().default(0),
});

export const BioThemeSchema = z.object({
  background: z.string(),
  cardBackground: z.string(),
  textColor: z.string(),
  accentColor: z.string(),
  fontFamily: z.string().default("Inter"),
  buttonStyle: z.enum(["rounded", "pill", "square"]).default("rounded"),
});

export const UpdateBioPageSchema = z.object({
  title: z.string().min(1).max(60).optional(),
  description: z.string().max(160).optional(),
  avatarUrl: z.string().url().optional(),
  theme: BioThemeSchema.partial().optional(),
  buttons: z.array(BioButtonSchema).optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string().url() })).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateBioPageInput = z.infer<typeof UpdateBioPageSchema>;
