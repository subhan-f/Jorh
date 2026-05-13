import type { JorhClient } from "../client";
import type {
  ApiResponse,
  LoginBody,
  RegisterBody,
  UpdateProfileBody,
  User,
} from "../types";

export class AuthResource {
  constructor(private client: JorhClient) {}

  register(body: RegisterBody) {
    return this.client.post<ApiResponse<{ user: User; token: string }>>(
      "/api/auth/register",
      body,
    );
  }

  login(body: LoginBody) {
    return this.client.post<ApiResponse<{ user: User; token: string }>>(
      "/api/auth/login",
      body,
    );
  }

  logout() {
    return this.client.post<ApiResponse>("/api/auth/logout", {});
  }

  getProfile() {
    return this.client.get<ApiResponse<User>>("/api/auth/me");
  }

  updateProfile(body: UpdateProfileBody) {
    return this.client.patch<ApiResponse<User>>("/api/auth/me", body);
  }
}
