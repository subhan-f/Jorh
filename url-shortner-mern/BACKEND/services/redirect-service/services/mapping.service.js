import MappingModel from "../models/mapping.model.js";

class MappingService {
  createMapping = async ({ _id, originalUrl, expiresAt = null }) => {
    const mappingData = { _id, originalUrl };

    if (expiresAt) {
      mappingData.expiresAt = expiresAt;
    }
    const mapping = await MappingModel.create(mappingData);
    return mapping;
  };
  updateMapping = async ({ _id, ...newData }) => {
    const mapping = await MappingModel.findByIdAndUpdate(
      { _id },
      { $set: newData },
      {
        returnDocument: "after",
      }
    );
    return mapping;
  };
  deleteMapping = async ({ _id }) => {
    await MappingModel.findByIdAndDelete({ _id });
    return true;
  };
  getMapping = async ({ _id }) => {
    const mapping = await MappingModel.findById({ _id });
    return mapping;
  };
}

const mappingService = new MappingService();
export default mappingService;
