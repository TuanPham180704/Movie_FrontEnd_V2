import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieApi = {
  getAll: async (params) => {
    const res = await api.get("/admin/movies", { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/admin/movies/${id}`);
    return res.data;
  },
};
