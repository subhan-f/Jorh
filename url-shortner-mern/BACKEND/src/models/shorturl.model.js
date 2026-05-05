import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    original_url: {
      type: String,
      required: true,
    },
    short_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    short_url: {
      type: String,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
