import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, required: true },
    ip: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String,
    deviceType: String,
    browser: String,
    os: String,
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "slug",
      granularity: "seconds",
    },
  },
);

export default mongoose.model("Click", clickSchema);
