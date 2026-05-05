import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/env.config.js";

export const generateShortId = async (length) => {
  return await nanoid(length);
};

export const signToken = async (payload, secret, options) => {
  // Implement JWT signing logic here, e.g., using jsonwebtoken library
  return await jwt.sign(payload, secret, options);
};

export const verifyToken = async (token, secret) => {
  // Implement JWT verification logic here, e.g., using jsonwebtoken library
  try {
    return await jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const generateAccessToken = async (user) => {
  return await signToken({ userId: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = async (user) => {
  return await signToken({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = async (token) => {
  return await verifyToken(token, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);
};

export const verifyRefreshToken = async (token) => {
  return await verifyToken(token, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
};
