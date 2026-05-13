import clickService from "../services/click.service.js";

class ClickController {
  handleRecordClick = async (req, res, next) => {
    try {
      const slug = req.params.slug || req.body.slug;
      if (!slug) throw new Error("Missing slug");

      const { ip, userAgent, referrer } = req.body;
      if (!ip || !userAgent) throw new Error("Missing required fields: ip, userAgent");

      const click = await clickService.recordClick({ slug, ip, userAgent, referrer });
      res.status(201).json({ success: true, result: click });
    } catch (err) {
      next(err);
    }
  };

  handleGetClicks = async (req, res, next) => {
    try {
      const { filter, pagination } = req.query;
      const [clicks, count] = await Promise.all([
        clickService.getClicks(filter, pagination),
        clickService.getClicksCount(filter),
      ]);
      res.status(200).json({ success: true, result: { clicks, count } });
    } catch (err) {
      next(err);
    }
  };
}

const clickController = new ClickController();
export default clickController;
