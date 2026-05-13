import { publishEvent, EXCHANGES } from "@repo/shared-messaging";

class LinkPublisher {
  publishCreatedLink = (link) =>
    publishEvent(EXCHANGES.LINK_EVENTS, { ...link, action: "create" });

  publishUpdatedLink = (link) =>
    publishEvent(EXCHANGES.LINK_EVENTS, { ...link, action: "update" });

  publishDeletedLink = (link) =>
    publishEvent(EXCHANGES.LINK_EVENTS, { ...link, action: "delete" });
}

const linkPublisher = new LinkPublisher();
export default linkPublisher;
