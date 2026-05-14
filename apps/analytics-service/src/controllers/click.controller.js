import clickService from "../services/click.service.js";

class ClickController {
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
