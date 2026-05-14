import redirectService from "../services/redirect.service.js";

function extractIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = forwarded ? forwarded.split(",")[0].trim() : req.ip;
  // Strip IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 → 1.2.3.4)
  return raw.replace(/^::ffff:/i, "");
}

class RedirectController {
  handleRedirect = async (req, res, next) => {
    try {
      const url = await redirectService.redirectToOriginalUrl(
        req.params.slug,
        extractIp(req),
        req.headers["user-agent"],
        req.get("Referrer"),
      );
      res.redirect(301, url);
    } catch (err) {
      next(err);
    }
  };
}

const redirectController = new RedirectController();
export default redirectController;
