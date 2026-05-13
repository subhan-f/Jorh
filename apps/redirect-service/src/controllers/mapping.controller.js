import mappingService from "../services/mapping.service.js";

class MappingController {
  handleCreateMapping = async (req, res, next) => {
    try {
      const { slug, originalUrl, expiresAt } = req.body;
      if (!slug || !originalUrl) throw new Error("slug and originalUrl are required");

      const mapping = await mappingService.createMapping({ _id: slug, originalUrl, expiresAt });
      res.status(201).json({ success: true, message: "Mapping created successfully", result: mapping });
    } catch (err) {
      next(err);
    }
  };

  handleUpdateMapping = async (req, res, next) => {
    try {
      const mapping = await mappingService.updateMapping({ _id: req.params.slug, ...req.body });
      if (!mapping) {
        return res.status(404).json({ success: false, message: "Mapping not found" });
      }
      res.status(200).json({ success: true, message: "Mapping updated successfully", result: mapping });
    } catch (err) {
      next(err);
    }
  };

  handleDeleteMapping = async (req, res, next) => {
    try {
      await mappingService.deleteMapping({ _id: req.params.slug });
      res.status(200).json({ success: true, message: "Mapping deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

const mappingController = new MappingController();
export default mappingController;
