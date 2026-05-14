import { createClient } from "@repo/api-client";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const jorh = createClient(BASE_URL);

export function setAuthToken(token: string) {
  jorh.client.setToken(token);
}

export function clearAuthToken() {
  jorh.client.clearToken();
}
