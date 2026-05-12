import mappingService from "../services/mapping.service.js";

class MappingController {
  handleCreateMapping = async (req, res, next) => {
    try {
      let { originalUrl, slug, expiresAt } = req.body;
      if (!slug || !originalUrl) {
        throw new Error("Slug and originalUrl is required");
      }
      const mapping = await mappingService.createMapping({
        _id: slug,
        originalUrl: originalUrl,
        expiresAt: expiresAt,
      });
      res.status(201).json({
        success: true,
        message: "Mapping created successfully",
        result: mapping,
      });
    } catch (err) {
      next(err);
    }
  };

  handleUpdateMapping = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const newData = req.body;
      const mapping = await mappingService.updateMapping({ _id: slug, ...newData });
      if (!mapping) {
        res.status(404).json({
          success: false,
          message: "Mapping not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Mapping updated successfully",
          result: mapping,
        });
      }
    } catch (err) {
      next(err);
    }
  };
  handleDeleteMapping = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const message = await mappingService.deleteMapping({ _id: slug });
      res.status(204).json({
        success: true,
        message: message,
      });
    } catch (err) {
      next(err);
    }
  };
}

const mappingController = new MappingController();

export default mappingController;
