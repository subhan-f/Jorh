import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/env.js";

const signToken = async (payload, secret, options) => {
  return await jwt.sign(payload, secret, options);
};

const verifyToken = async (token, secret) => {
  try {
    return await jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const generateAccessToken = async (user) => {
  return await signToken(
    { userId: user._id, email: user.email, role: user.role },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = async (user) => {
  return await signToken(
    { userId: user._id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = async (token) => {
  return await verifyToken(token, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);
};

export const verifyRefreshToken = async (token) => {
  return await verifyToken(token, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
};
