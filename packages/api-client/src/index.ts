export { JorhClient, ApiError } from "./client";
export { AuthResource } from "./resources/auth";
export { LinksResource } from "./resources/links";
export { AnalyticsResource } from "./resources/analytics";
export type * from "./types";

import { JorhClient } from "./client";
import { AuthResource } from "./resources/auth";
import { LinksResource } from "./resources/links";
import { AnalyticsResource } from "./resources/analytics";

export function createClient(baseUrl: string, token?: string) {
  const client = new JorhClient(baseUrl, token);
  return {
    client,
    auth: new AuthResource(client),
    links: new LinksResource(client),
    analytics: new AnalyticsResource(client),
  };
}
