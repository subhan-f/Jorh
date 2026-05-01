import type { Env } from "./types.js";

export async function recordClick(request: Request, linkId: string, env: Env): Promise<void> {
  try {
    const cf = (request as Request & { cf?: IncomingRequestCfProperties }).cf;
    const ua = request.headers.get("User-Agent") ?? "";

    const payload = {
      linkId,
      timestamp: new Date().toISOString(),
      country: cf?.country ?? "unknown",
      city: cf?.city ?? "unknown",
      region: cf?.region ?? "unknown",
      device: detectDevice(ua),
      browser: detectBrowser(ua),
      os: detectOs(ua),
      referrer: request.headers.get("Referer") ?? "",
    };

    await fetch(`${env.API_URL}/analytics/click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": env.INTERNAL_API_SECRET,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Never block a redirect for analytics
  }
}

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(ua: string): string {
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/") && !ua.includes("Chromium/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "Other";
}

function detectOs(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}
