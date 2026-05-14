import mappingService from "./mapping.service.js";
import { publishClick } from "./publishers/click.publisher.js";
import logger from "../config/logger.js";

class RedirectService {
  redirectToOriginalUrl = async (slug, ip, userAgent, referrer) => {
    const mapping = await mappingService.getMapping({ _id: slug });
    if (!mapping) throw new Error("Slug not found");
    if (mapping.expiresAt && new Date() > mapping.expiresAt) throw new Error("Slug has expired");

    // fire-and-forget — don't block the redirect on analytics
    publishClick({ slug, ip, userAgent, referrer }).catch((err) =>
      logger.error({ err: err.message, slug }, "failed to publish click"),
    );

    return mapping.originalUrl;
  };
}

const redirectService = new RedirectService();
export default redirectService;
