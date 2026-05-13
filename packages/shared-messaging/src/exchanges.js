// Fanout exchange names — each exchange fans out to all bound queues,
// so every subscriber gets its own copy of every message.
export const EXCHANGES = Object.freeze({
  LINK_EVENTS: "jorh.link.events",   // link lifecycle events (links-service → redirect + analytics)
  CLICK_EVENTS: "jorh.click.events", // click tracking events (redirect-service → analytics)
});
