/*

Create Links schema model:

{
  slug: string,            // unique, indexed
  user: ObjectId,             // owner
  originalUrl: string,
  title: string,
  tags: [string],
  customAlias: string | null,
  expiresAt: Date | null,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
}


*/

import mongoose from "mongoose";
import { nanoid } from "nanoid";

const LinkSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: function () {
        return nanoid(7);
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    customAlias: {
      type: String,
      default: null,
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

const LinkModel = mongoose.model("Link", LinkSchema);

export default LinkModel;
