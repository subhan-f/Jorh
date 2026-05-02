import { getIdToken } from "@jorh/firebase/auth";
import type { ApiResponse } from "@jorh/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(
  path: string,
  init: RequestInit = {},
  retryWithFreshToken = true
): Promise<ApiResponse<T>> {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (res.status === 401 && retryWithFreshToken) {
    const freshToken = await getIdToken(true);
    if (freshToken) {
      return request<T>(path, init, false);
    }
  }
  return res.json() as Promise<ApiResponse<T>>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
