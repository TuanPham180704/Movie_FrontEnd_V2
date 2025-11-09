import axios from "axios";
import { logout } from "../utils/auth";

const API_BASE = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 1000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status == 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
