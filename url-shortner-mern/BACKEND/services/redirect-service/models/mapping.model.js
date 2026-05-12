import mongoose from "mongoose";

const MappingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const MappingModel = mongoose.model("Mapping", MappingSchema);

export default MappingModel;
