import linkStatsService from "../services/linkStats.service.js";

export const getStats = async (req, res, next) => {
  try {
    const { slug } = req.params || req.query;
    const stats = await linkStatsService.getStats(slug);
    if (!stats) {
      return res.status(404).json({ success: false, message: "No stats found for this slug" });
    }
    res.status(200).json({ success: true, result: stats });
  } catch (error) {
    next(error);
  }
};
