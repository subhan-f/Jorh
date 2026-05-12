import axios from "@/utils/axiosInstance.js";

// Create register function
export const registerUser = async (name, email, password) => {
  const { data } = await axios.post("/api/auth/register", { name, email, password });
  return data;
};

// Create login function
export const loginUser = async (email, password) => {
  const { data } = await axios.post("/api/auth/login", { email, password });
  return data;
};

// Create logout function
export const logoutUser = async () => {
  const { data } = await axios.post("/api/auth/logout");
  return data;
};
