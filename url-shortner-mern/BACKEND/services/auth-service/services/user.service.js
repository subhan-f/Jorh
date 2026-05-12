import userModel from "../models/user.model.js";

class UserService {
  getUserProfile = async (userId) => {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };

  updateUserProfile = async (userId, userData) => {
    const user = await userModel
      .findByIdAndUpdate(userId, userData, { new: true })
      .select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };
}

const userService = new UserService();
export default userService;
