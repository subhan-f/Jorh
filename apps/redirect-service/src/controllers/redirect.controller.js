import redirectService from "../services/redirect.service.js";

class RedirectController {
  handleRedirect = async (req, res, next) => {
    try {
      const url = await redirectService.redirectToOriginalUrl(
        req.params.slug,
        req.ip,
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
