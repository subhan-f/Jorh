import mappingService from "./mapping.service.js";
import axios from "axios";
import rabbitmqService from "./rabbitMQ.service.js";

class RedirectService {
  redirectToOriginalUrl = async (slug, ip, userAgent, referrer) => {
    const mapping = await mappingService.getMapping(slug);
    if (!mapping) {
      throw new Error("Slug not found");
    }
    if (mapping.expiresAt && new Date() > new Date(mapping.expiresAt)) {
      throw new Error("Slug has expired");
    }

    rabbitmqService.publishClick({
      slug,
      ip,
      userAgent,
      referrer,
    });

    return mapping.originalUrl;
  };
}

const redirectService = new RedirectService();
export default redirectService;
