import shortUrlService from "../services/shorturl.service.js";

// src/controllers/shorturl.controller.js
class ShortUrlController {
  createShortUrl = async (req, res, next) => {
    // No try/catch – let Express 5 forward errors to error handler.
    const { url, domain } = req.body;

    // Basic validation – better with a dedicated middleware/library
    if (!url) throw new ValidationError("URL is required");
    if (domain && typeof domain !== "string") throw new ValidationError("Invalid domain format");

    const shortUrl = await shortUrlService.createShortUrl(url, domain);
    return res.status(201).json({
      success: true,
      message: "Short URL created",
      data: shortUrl,
    });
  };

  redirectToOriginalUrl = async (req, res, next) => {
    const { shortId } = req.params;
    const originalUrl = await shortUrlService.redirectToOriginalUrl(shortId);
    return res.redirect(originalUrl);
  };
}

const shortUrlController = new ShortUrlController();

export default shortUrlController;
