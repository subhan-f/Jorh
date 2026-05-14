import type { JorhClient } from "../client";
import type { ApiResponse, CreateLinkBody, Link, UpdateLinkBody } from "../types";

export class LinksResource {
  constructor(private client: JorhClient) {}

  list() {
    return this.client.get<ApiResponse<Link[]>>("/api/links/");
  }

  create(body: CreateLinkBody) {
    return this.client.post<ApiResponse<Link>>("/api/links", body);
  }

  get(slug: string) {
    return this.client.get<ApiResponse<Link>>(`/api/links/${slug}`);
  }

  update(slug: string, body: UpdateLinkBody) {
    return this.client.patch<ApiResponse<Link>>(`/api/links/${slug}`, body);
  }

  delete(slug: string) {
    return this.client.delete<ApiResponse>(`/api/links/${slug}`);
  }
}
