export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function addUtmParams(
  url: string,
  params: { source?: string; medium?: string; campaign?: string; term?: string; content?: string }
): string {
  try {
    const parsed = new URL(url);
    if (params.source) parsed.searchParams.set("utm_source", params.source);
    if (params.medium) parsed.searchParams.set("utm_medium", params.medium);
    if (params.campaign) parsed.searchParams.set("utm_campaign", params.campaign);
    if (params.term) parsed.searchParams.set("utm_term", params.term);
    if (params.content) parsed.searchParams.set("utm_content", params.content);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function truncateUrl(url: string, maxLength = 60): string {
  if (url.length <= maxLength) return url;
  return `${url.slice(0, maxLength)}…`;
}
