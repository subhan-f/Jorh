import shortUrlService from "../services/shorturl.service.js";
import { logger } from "../utils/logger.js";
import { ValidationError } from "../utils/AppError.js";

class ShortUrlController {
  createShortUrl = async (req, res, next) => {
    // No try/catch – let Express 5 forward errors to error handler.
    const { url, domain } = req.body;
    // if authenticated and req.user{id, email, name} exists, pass userId to service for ownership tracking
    const userId = req.user ? req.user.id : null;

    // Basic validation – better with a dedicated middleware/library
    if (!url) throw new ValidationError("URL is required");
    if (domain && typeof domain !== "string") throw new ValidationError("Invalid domain format");

    const shortUrl = await shortUrlService.createShortUrl(url, domain, userId);
    return res.status(201).json({
      success: true,
      message: "Short URL created",
      result: shortUrl,
    });
  };

  redirectToOriginalUrl = async (req, res, next) => {
    const { shortId } = req.params;
    const originalUrl = await shortUrlService.redirectToOriginalUrl(shortId);
    logger.info(`(controller) Redirecting shortId ${shortId} to ${originalUrl.originalUrl}`);
    return res.status(302).redirect(originalUrl);
  };
}

const shortUrlController = new ShortUrlController();

export default shortUrlController;
