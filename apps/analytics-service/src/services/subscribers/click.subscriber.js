import { subscribeToEvent, EXCHANGES } from "@repo/shared-messaging";
import clickService from "../click.service.js";
import logger from "../../config/logger.js";

export async function startClickSubscriber() {
  await subscribeToEvent(
    EXCHANGES.CLICK_EVENTS,
    "analytics.click-events", // durable named queue — unique to this service
    async (clickData) => {
      await clickService.recordClick(clickData);
    },
  );
  logger.info("Subscribed to click events");
}
