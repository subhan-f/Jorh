// src/dao/shorturl.dao.js
import ShortUrl from "../models/shorturl.model.js";
import { ConflictError, InternalServerError, ValidationError } from "../utils/AppError.js";

export const saveShortUrl = async ({ shortId, originalUrl, shortUrl, userId }) => {
  try {
    const newShortUrl = new ShortUrl({
      original_url: originalUrl,
      short_id: shortId, // FIXED: use the parameter, not hardcoded
      short_url: shortUrl,
      user: userId,
    });
    await newShortUrl.save();
    return newShortUrl;
  } catch (error) {
    if (error.code === 11000) throw new ConflictError("Short ID or URL already exists");

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      throw new ValidationError(messages);
    }
    throw new InternalServerError("Failed to save short URL");
  }
};

export const findShortUrlByShortId = async (shortId) => {
  try {
    const urlEntry = await ShortUrl.findOneAndUpdate(
      { short_id: shortId },
      { $inc: { clicks: 1 } }
    );
    return urlEntry;
  } catch (error) {
    throw new InternalServerError("Database query failed");
  }
};

export const findShortUrlsByUserId = async (userId) => {
  try {
    return await ShortUrl.find({ user: userId });
  } catch (error) {
    throw new InternalServerError("Failed to find short URLs");
  }
};

export const deleteShortUrlById = async (id, userId) => {
  try {
    const urlEntry = await ShortUrl.findOneAndDelete({ _id: id, user: userId });
    if (urlEntry) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    throw new InternalServerError("Failed to delete short URL");
  }
};
