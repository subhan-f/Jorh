// src/services/shorturl.service.js
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/AppError.js";
import { saveShortUrl, findShortUrlByShortId } from "../dao/shorturl.dao.js";
import { generateShortId } from "../utils/helper.js";
import { logger } from "../utils/logger.js";

class ShortUrlService {
  async createShortUrl(originalUrl, domain, userId = null) {
    // Validate and standardise
    let parsedUrl, parsedDomain;
    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      throw new BadRequestError("Invalid original URL");
    }
    try {
      // Fallback domain
      const domainStr = domain || process.env.DOMAIN || "http://localhost:3000";
      parsedDomain = new URL(domainStr);
    } catch {
      throw new BadRequestError("Invalid domain");
    }

    const shortId = generateShortId(7);
    const shortUrl = `${parsedDomain}${shortId}`;

    const newEntry = await saveShortUrl({
      shortId,
      originalUrl: parsedUrl.href,
      shortUrl,
      userId,
    });

    return {
      short_url: newEntry.short_url,
      short_id: newEntry.short_id,
    };
  }

  async redirectToOriginalUrl(shortId) {
    const urlEntry = await findShortUrlByShortId(shortId);
    if (!urlEntry) {
      throw new NotFoundError("Short URL not found");
    }
    return urlEntry.original_url;
  }

  async deleteShortUrl(shortId, userId = null) {
    const deleted = await deleteShortUrlById(shortId, userId);
    if (!deleted) throw new NotFoundError("Short URL not found");
  }
}

const shortUrlService = new ShortUrlService();
export default shortUrlService;
