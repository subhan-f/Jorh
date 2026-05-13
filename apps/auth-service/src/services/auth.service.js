import User from "../models/user.model.js";
import BlackListToken from "../models/blackListToken.model.js";
import { generateAccessToken, verifyAccessToken } from "../config/tokens.js";

class AuthService {
  register = async (name, email, password) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email is already registered");

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user);

    return { name: user.name, email: user.email, role: user.role, avatar: user.avatar, accessToken };
  };

  login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid email or password");

    const accessToken = generateAccessToken(user);
    return { name: user.name, email: user.email, role: user.role, avatar: user.avatar, accessToken };
  };

  logout = async (token) => {
    // Blacklist until the token's own expiry so MongoDB TTL cleans it up automatically
    const decoded = verifyAccessToken(token);
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 3_600_000);

    await BlackListToken.create({ token, expiresAt });
  };
}

const authService = new AuthService();
export default authService;
