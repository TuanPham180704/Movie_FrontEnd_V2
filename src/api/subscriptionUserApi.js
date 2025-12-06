import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Interceptor để luôn cập nhật token trước mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const subscriptionUserApi = {
  getPlans: async () => {
    const res = await api.get("/user/subscriptions/plans");
    return res.data;
  },
  getPlanById: async (id) => {
    const res = await api.get(`/user/subscriptions/plans/${id}`);
    return res.data;
  },
  buyPlan: async (planId) => {
    const res = await api.post("/user/subscriptions", { plan_id: planId });
    return res.data;
  },
  getUserSubscriptions: async () => {
    const res = await api.get("/user/subscriptions");
    return res.data;
  },
  getUserSubscriptionById: async (id) => {
    const res = await api.get(`/user/subscriptions/${id}`);
    return res.data;
  },
};
