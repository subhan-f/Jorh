export type Device = "mobile" | "tablet" | "desktop" | "unknown";

export interface Click {
  id: string;
  linkId: string;
  workspaceId?: string;
  timestamp: Date;
  country?: string;
  city?: string;
  region?: string;
  device: Device;
  browser?: string;
  os?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface ClickDataPoint {
  date: string;
  count: number;
}

export interface ClickStats {
  total: number;
  change: number;
  byDate: ClickDataPoint[];
  byCountry: Array<{ country: string; count: number }>;
  byDevice: Array<{ device: Device; count: number }>;
  byBrowser: Array<{ browser: string; count: number }>;
  byOs: Array<{ os: string; count: number }>;
  byReferrer: Array<{ referrer: string; count: number }>;
}

export type AnalyticsGranularity = "hour" | "day" | "week" | "month";

export interface AnalyticsQuery {
  from: string;
  to: string;
  granularity?: AnalyticsGranularity;
}
