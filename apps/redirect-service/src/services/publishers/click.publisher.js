import { publishEvent, EXCHANGES } from "@repo/shared-messaging";

export async function publishClick({ slug, ip, userAgent, referrer }) {
  await publishEvent(EXCHANGES.CLICK_EVENTS, { slug, ip, userAgent, referrer });
}
