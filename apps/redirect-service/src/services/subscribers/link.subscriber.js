import { subscribeToEvent, EXCHANGES } from "@repo/shared-messaging";
import mappingService from "../mapping.service.js";
import logger from "../../config/logger.js";

export async function startLinkSubscriber() {
  await subscribeToEvent(
    EXCHANGES.LINK_EVENTS,
    "redirect.link-events", // durable named queue — unique to this service
    async ({ action, slug, originalUrl, expiresAt }) => {
      switch (action) {
        case "create":
          await mappingService.createMapping({ _id: slug, originalUrl, expiresAt });
          logger.debug({ slug }, "Mapping created");
          break;
        case "update":
          await mappingService.updateMapping({ _id: slug, originalUrl, expiresAt });
          logger.debug({ slug }, "Mapping updated");
          break;
        case "delete":
          await mappingService.deleteMapping({ _id: slug });
          logger.debug({ slug }, "Mapping deleted");
          break;
        default:
          logger.warn({ action }, "Unknown link action received");
      }
    },
  );
  logger.info("Subscribed to link events");
}
