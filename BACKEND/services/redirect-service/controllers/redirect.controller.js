// create redirect logic for controller
import redirectService from "../services/redirect.service.js";

class RedirectController {
  handleRedirect = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const url = await redirectService.redirectToOriginalUrl(
        slug,
        req.ip,
        req.headers["user-agent"],
        req.get("Referrer")
      );
      if (!url) {
        return res.status(404).json({
          success: false,
          message: "Mapping not found",
        });
      }
      res.status(301).redirect(url);
    } catch (err) {
      next(err);
    }
  };
}

const redirectController = new RedirectController();

export default redirectController;
