import User from "../models/user.model.js";

export const createUser = async (name, email, password) => {
  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  return user;
};

export const findUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;
  return user;
};
