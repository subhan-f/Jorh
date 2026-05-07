import axios from "axios";

import { API_BASE_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: null,
        original: error,
      });
    }

    const { status, data } = error.response;
    const serverMessage = data?.message || data?.error;

    const statusMessages = {
      400: serverMessage || "Bad request.",
      401: serverMessage || "Unauthorized. Please log in again.",
      403: serverMessage || "You don't have permission to do that.",
      404: serverMessage || "The requested resource was not found.",
      409: serverMessage || "Conflict with current state.",
      422: serverMessage || "Validation failed.",
      429: serverMessage || "Too many requests. Slow down.",
      500: "Server error. Please try again later.",
    };

    // Redirect to login on 401 if a token existed (session expired)
    if (status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: statusMessages[status] ?? serverMessage ?? "Something went wrong.",
      status,
      data,
      original: error,
    });
  }
);

export default axiosInstance;
