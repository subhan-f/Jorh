import userService from "../services/user.service.js";

class UserController {
  handleGetProfile = async (req, res, next) => {
    try {
      const user = await userService.getUserProfile(req.user._id);
      res.status(200).json({ success: true, message: "Profile retrieved successfully", result: user });
    } catch (err) {
      next(err);
    }
  };

  handleUpdateProfile = async (req, res, next) => {
    try {
      const user = await userService.updateUserProfile(req.user._id, req.body);
      res.status(200).json({ success: true, message: "Profile updated successfully", result: user });
    } catch (err) {
      next(err);
    }
  };
}

const userController = new UserController();
export default userController;
