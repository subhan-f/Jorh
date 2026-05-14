import clickService from "../services/click.service.js";

class ClickController {
  handleGetClicks = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [clicks, count] = await Promise.all([
        clickService.getClicks({ slug }, { skip, limit: Number(limit) }),
        clickService.getClicksCount({ slug }),
      ]);

      res.status(200).json({ success: true, result: clicks, total: count });
    } catch (err) {
      next(err);
    }
  };
}

const clickController = new ClickController();
export default clickController;
