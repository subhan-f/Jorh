import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import userModel from "../models/user.model.js";
import blackListTokenModel from "../models/blackListToken.model.js";

class AuthService {
  register = async (name, email, password) => {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    // Create new user
    const user = await userModel.create({ name, email, password });

    if (!user) {
      throw new Error("Failed to create user");
    }

    const accessToken = await generateAccessToken(user);

    console.log(`New user registered: ${email}`);

    return { email: user.email, name: user.name, avatar: user.avatar, accessToken };
  };

  login = async (email, password) => {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const accessToken = await generateAccessToken(user);

    console.log(`User logged in: ${email}`);

    return { email: user.email, name: user.name, avatar: user.avatar, accessToken };
  };

  logout = async (token) => {
    // implement token blacklisting here.
    const blackListToken = await blackListTokenModel.create({
      token: token,
      expiresAt: new Date(),
    });

    if (!blackListToken) {
      throw new Error("Failed to blacklist token");
    }

    console.log(`User logged out: ${token}`);
    return { success: true, message: "Logout successful" };
  };
}

const authService = new AuthService();
export default authService;
