import { subscribeToEvent, EXCHANGES } from "@repo/shared-messaging";
import linkStatsService from "../linkStats.service.js";
import logger from "../../config/logger.js";

export async function startLinkSubscriber() {
  await subscribeToEvent(
    EXCHANGES.LINK_EVENTS,
    "analytics.link-events", // durable named queue — unique to this service
    async (linkEvent) => {
      if (linkEvent.action === "delete") {
        await linkStatsService.deleteStats(linkEvent.slug);
        logger.debug({ slug: linkEvent.slug }, "Stats deleted for removed link");
      }
      // create/update: stats initialised lazily on first click via upsert
    },
  );
  logger.info("Subscribed to link events");
}
