import axios from "@/utils/axiosInstance.js"

export const createShortLink = async (url, domain = null) => {
  const payload = { url }
  if (domain) payload.domain = domain
  const { data } = await axios.post("/api/shorturls", payload)
  return data
}

export const getLinks = async () => {
  const { data } = await axios.get("/api/shorturls")
  return data
}

export const getDashboardStats = async () => {
  const { data } = await axios.get("/api/dashboard/stats")
  return data
}
