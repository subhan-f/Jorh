import linkService from "../services/link.service.js";

class LinkController {
  handleCreateLink = async (req, res, next) => {
    try {
      const { user } = req;
      const { originalUrl, tags, title } = req.body;

      if (!originalUrl) throw new Error("Original URL is required");

      const link = await linkService.createLink({ originalUrl, tags, title, userId: user._id });

      res.status(201).json({
        success: true,
        message: "Link created successfully",
        result: link,
      });
    } catch (err) {
      next(err);
    }
  };

  handleGetLinks = async (req, res, next) => {
    try {
      const links = await linkService.getLinks(req.user._id);
      res.status(200).json({
        success: true,
        message: "Links retrieved successfully",
        result: links,
      });
    } catch (err) {
      next(err);
    }
  };

  handleGetLink = async (req, res, next) => {
    try {
      const link = await linkService.getLink(req.params.slug, req.user._id);
      if (!link) {
        return res.status(404).json({ success: false, message: "Link not found" });
      }
      res.status(200).json({
        success: true,
        message: "Link retrieved successfully",
        result: link,
      });
    } catch (err) {
      next(err);
    }
  };

  handleUpdateLink = async (req, res, next) => {
    try {
      const link = await linkService.updateLink(req.params.slug, req.user._id, req.body);
      res.status(200).json({
        success: true,
        message: "Link updated successfully",
        result: link,
      });
    } catch (err) {
      next(err);
    }
  };

  handleDeleteLink = async (req, res, next) => {
    try {
      await linkService.deleteLink(req.params.slug, req.user._id);
      res.status(200).json({ success: true, message: "Link deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

const linkController = new LinkController();
export default linkController;
