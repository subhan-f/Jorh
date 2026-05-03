import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../.env") });

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3002),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Pipe-separated list of allowed CORS origins, e.g. "https://a.com|https://b.com"
  // Pipe avoids conflict with the comma delimiter used by `gcloud --set-env-vars`
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000|http://localhost:3001")
    .transform((s) => s.split("|").map((o) => o.trim()).filter(Boolean)),
  ADMIN_EMAILS: z.string().default(""),
  // Firebase Admin
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  // Cloudflare KV sync
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_KV_NAMESPACE_ID: z.string().optional(),
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_PRO_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_BUSINESS_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_BUSINESS_YEARLY_PRICE_ID: z.string().optional(),
  // Resend
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@jorh.net"),
  // Internal auth between Worker and API
  INTERNAL_API_SECRET: z.string().default("dev-secret"),
  // Base URL for redirect links (used to build QR target URLs)
  REDIRECT_BASE_URL: z.string().url().default("https://go.jorh.net"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
