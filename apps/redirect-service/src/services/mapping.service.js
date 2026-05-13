import MappingModel from "../models/mapping.model.js";

class MappingService {
  createMapping = async ({ _id, originalUrl, expiresAt }) => {
    return MappingModel.create({
      _id,
      originalUrl,
      ...(expiresAt && { expiresAt }),
    });
  };

  updateMapping = async ({ _id, ...newData }) => {
    return MappingModel.findByIdAndUpdate(_id, { $set: newData }, { returnDocument: "after" });
  };

  deleteMapping = async ({ _id }) => {
    await MappingModel.findByIdAndDelete(_id);
  };

  getMapping = async ({ _id }) => {
    return MappingModel.findById(_id);
  };
}

const mappingService = new MappingService();
export default mappingService;
