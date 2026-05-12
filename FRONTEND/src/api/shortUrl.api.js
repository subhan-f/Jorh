import axios from "@/utils/axiosInstance.js";

export const createShortUrl = async (originalurl, domain = null) => {
  const payload = { url: originalurl };
  if (domain) payload.domain = domain;
  const { data } = await axios.post("/api/shorturls", payload);
  console.log("API Response Data:", data);
  return data;
};
