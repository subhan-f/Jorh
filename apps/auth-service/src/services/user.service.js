import User from "../models/user.model.js";

class UserService {
  getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  };

  updateUserProfile = async (userId, data) => {
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  };
}

const userService = new UserService();
export default userService;
