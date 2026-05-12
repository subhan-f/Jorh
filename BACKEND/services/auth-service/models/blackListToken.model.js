// create black list token model to store blacklisted tokens in the database

import mongoose from "mongoose";

const BlackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const BlackListToken = mongoose.model("BlackListToken", BlackListTokenSchema);

export default BlackListToken;
