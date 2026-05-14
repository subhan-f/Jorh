import { setAuthToken, clearAuthToken } from "./api";
import { queryClient } from "./query";

const TOKEN_KEY = "jorh_token";
const USER_KEY = "jorh_user";

export interface StoredUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function storeAuth(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthToken(token);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearAuthToken();
  queryClient.clear();
}
