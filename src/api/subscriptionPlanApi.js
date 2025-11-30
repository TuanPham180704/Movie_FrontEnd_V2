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
export const subscriptionPlanApi = {
  getAll: async () => {
    const res = await api.get("/admin/subscription-plans");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/subscription-plans/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/subscription-plans", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.patch(`/admin/subscription-plans/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/subscription-plans/${id}`);
    return res.data;
  },
};
