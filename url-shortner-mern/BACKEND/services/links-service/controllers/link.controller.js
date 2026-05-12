import linkService from "../services/link.service.js";
import { ACCESS_COOKIE_OPTIONS } from "../config/env.js";

class LinkController {
  handleCreateLink = async (req, res, next) => {
    try {
      const { user } = req;
      if (!user || !user._id) throw new Error("(c) User not found");

      const { originalUrl, tags, title } = req.body;
      if (!originalUrl) {
        throw new Error("Original URL is required");
      }

      console.log(`Original Url (controller): ${originalUrl}`);

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
      const { user } = req;
      if (!user || !user._id) throw new Error("(c) User not found");
      const links = await linkService.getLinks(user._id);
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
      const { slug } = req.params;
      const { user } = req;
      if (!user || !user._id) throw new Error("(c) User not found");
      const link = await linkService.getLink(slug, user._id);
      if (!link) {
        return res.status(404).json({
          success: false,
          message: "Link not found",
        });
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
      const { slug } = req.params;
      const { user } = req;
      if (!user || !user._id) throw new Error("(c) User not found");

      const newData = req.body;
      const link = await linkService.updateLink(slug, user._id, newData);
      if (!link) {
        res.status(404).json({
          success: false,
          message: "Link not found",
        });
      }
      const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }

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
      const { slug } = req.params;
      const { user } = req;
      if (!user || !user._id) throw new Error("(c) User not found");
      const message = await linkService.deleteLink(slug, user._id);

      const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }

      res.status(204).json({
        success: true,
        message: message,
      });
    } catch (err) {
      next(err);
    }
  };
}

const linkController = new LinkController();

export default linkController;
