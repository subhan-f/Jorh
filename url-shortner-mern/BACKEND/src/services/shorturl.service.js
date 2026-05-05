// src/services/shorturl.service.js
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/AppError.js";
import { saveShortUrl, findShortUrlByShortId } from "../dao/shorturl.dao.js";
import { generateShortId } from "../utils/helper.js";
import { logger } from "../utils/logger.js";

class ShortUrlService {
  async createShortUrl(originalUrl, domain, userId) {
    let parsedUrl, parsedDomain;
    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      throw new BadRequestError("Invalid original URL");
    }
    try {
      const domainStr = domain || process.env.DOMAIN || "http://localhost:3000";
      parsedDomain = new URL(domainStr);
    } catch {
      throw new BadRequestError("Invalid domain");
    }

    const shortId = await generateShortId(7);
    const shortUrl = `${parsedDomain}${shortId}`;

    const newEntry = await saveShortUrl({
      shortId,
      originalUrl: parsedUrl.href,
      shortUrl,
      userId,
    });

    return { shortUrl: newEntry.shortUrl, shortId: newEntry.shortId };
  }

  async redirectToOriginalUrl(shortId) {
    const urlEntry = await findShortUrlByShortId(shortId);
    if (!urlEntry) {
      throw new NotFoundError("Short URL not found");
    }

    logger.info(`(service) Redirecting shortId ${shortId} to ${urlEntry.originalUrl}`);

    return urlEntry.originalUrl;
  }

  async deleteShortUrl(shortId, userId) {
    const deleted = await deleteShortUrlById(shortId, userId);
    if (!deleted) throw new NotFoundError("Short URL not found");
  }
}

const shortUrlService = new ShortUrlService();
export default shortUrlService;
