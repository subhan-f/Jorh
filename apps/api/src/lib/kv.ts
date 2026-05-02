import { env } from "../env.js";

interface KvLinkData {
  id: string;
  originalUrl: string;
  isActive: boolean;
  expiresAt?: number;
  clickLimit?: number;
  clickCount: number;
  password?: string;
}

async function cfKvRequest(method: string, key: string, body?: unknown): Promise<Response> {
  const base = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${env.CLOUDFLARE_KV_NAMESPACE_ID}`;
  return fetch(`${base}/values/${key}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function kvConfigured(): boolean {
  return !!(env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_KV_NAMESPACE_ID);
}

export async function kvSet(shortCode: string, data: KvLinkData): Promise<void> {
  if (!kvConfigured()) return;
  await cfKvRequest("PUT", shortCode, data);
}

export async function kvDelete(shortCode: string): Promise<void> {
  if (!kvConfigured()) return;
  await cfKvRequest("DELETE", shortCode);
}
