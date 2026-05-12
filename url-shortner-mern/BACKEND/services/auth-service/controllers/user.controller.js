import userService from "../services/user.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("Unauthorized");
    }
    const userProfile = await userService.getUserProfile(req.user._id);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      result: userProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {};
