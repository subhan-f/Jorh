// create this auth service which will use user dao to interact with the database and perform authentication related operations like register, login, logout, etc.

import { logger } from "../utils/logger.js";
import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { AppError, UnauthorizedError, ConflictError } from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/helper.js";

class AuthService {
  register = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    // Create new user
    const user = await createUser(name, email, password);

    const accessToken = await generateAccessToken(user);
    // const refreshToken = await generateRefreshToken(user);

    logger.info(`New user registered: ${email}`);

    return { email: user.email, name: user.name, avatar: user.avatar, accessToken };
  };

  login = async (email, password) => {
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate JWT token
    const accessToken = await generateAccessToken(user);
    // const refreshToken = await generateRefreshToken(user);

    logger.info(`User logged in: ${email}`);

    return { email: user.email, name: user.name, avatar: user.avatar, accessToken };
  };

  logout = async (userId) => {
    // For JWT, logout is typically handled on the client side by deleting the token.
    // Optionally, you could implement token blacklisting here if needed.
    logger.info(`User logged out: ${userId}`);
    return { success: true, message: "Logout successful" };
  };
}

const authService = new AuthService();
export default authService;
