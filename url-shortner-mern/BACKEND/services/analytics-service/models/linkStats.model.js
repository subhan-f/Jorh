import mongoose from "mongoose";

const linkStatsSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  totalClicks: { type: Number, default: 0 },
  dailyClicks: [
    {
      date: String,
      count: Number,
    },
  ],
  topReferrers: [
    {
      referrer: String,
      count: Number,
    },
  ],
  topCountries: [
    {
      country: String,
      count: Number,
    },
  ],
  devices: {
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  browsers: Map,
  operatingSystems: Map,
  lastUpdated: Date,
});

export default mongoose.model("LinkStats", linkStatsSchema);
