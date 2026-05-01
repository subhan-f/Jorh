export interface Env {
  LINKS_KV: KVNamespace;
  CLICK_QUEUE?: Queue;
  API_URL: string;
  INTERNAL_API_SECRET: string;
  ENVIRONMENT: string;
}

export interface StoredLink {
  id: string;
  originalUrl: string;
  isActive: boolean;
  expiresAt?: number;
  clickLimit?: number;
  clickCount: number;
  password?: string;
  passwordHash?: string;
}
