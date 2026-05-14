import type { JorhClient } from "../client";
import type {
  ApiResponse,
  AuthResult,
  LoginBody,
  RegisterBody,
  UpdateProfileBody,
} from "../types";

export class AuthResource {
  constructor(private client: JorhClient) {}

  register(body: RegisterBody) {
    return this.client.post<ApiResponse<AuthResult>>(
      "/api/auth/register",
      body,
    );
  }

  login(body: LoginBody) {
    return this.client.post<ApiResponse<AuthResult>>(
      "/api/auth/login",
      body,
    );
  }

  logout() {
    return this.client.post<ApiResponse>("/api/auth/logout", {});
  }

  getProfile() {
    return this.client.get<ApiResponse<AuthResult>>("/api/users/profile");
  }

  updateProfile(body: UpdateProfileBody) {
    return this.client.patch<ApiResponse<AuthResult>>("/api/users/profile", body);
  }
}
