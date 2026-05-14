import mongoose from "mongoose";

const linkStatsSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  totalClicks: { type: Number, default: 0 },
  uniqueClicks: { type: Number, default: 0 },
  lastClickAt: { type: Date, default: null },
  dailyClicks: [{ date: String, count: Number }],
  topReferrers: [{ referrer: String, count: Number }],
  topCountries: [{ country: String, count: Number }],
  devices: {
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  browsers: { type: Map, of: Number },
  operatingSystems: { type: Map, of: Number },
});

export default mongoose.model("LinkStats", linkStatsSchema);
