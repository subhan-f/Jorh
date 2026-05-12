import axios from "@/utils/axiosInstance.js";

export const createLink = async (url, domain = null) => {
  const payload = { url };
  if (domain) payload.domain = domain;
  const { data } = await axios.post("/api/links", payload);
  return data;
};

export const getLinks = async () => {
  const { data } = await axios.get("/api/links");
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await axios.get("/api/analytics/");
  return data;
};
