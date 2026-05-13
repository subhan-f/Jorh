import mongoose from "mongoose";

const BlackListTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Auto-delete documents once the token's own expiry has passed
BlackListTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("BlackListToken", BlackListTokenSchema);
