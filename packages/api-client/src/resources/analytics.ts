import type { JorhClient } from "../client";
import type { ApiResponse, Click, ClickHistoryQuery, LinkStats, PaginatedResponse } from "../types";

export class AnalyticsResource {
  constructor(private client: JorhClient) {}

  getLinkStats(slug: string) {
    return this.client.get<ApiResponse<LinkStats>>(`/api/analytics/stats/${slug}`);
  }

  getClickHistory(slug: string, query?: ClickHistoryQuery) {
    const qs = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : "";
    return this.client.get<PaginatedResponse<Click>>(`/api/analytics/clicks/${slug}${qs}`);
  }
}
