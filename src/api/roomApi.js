import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const roomApi = {
  getAll: async () => {
    const res = await api.get("/admin/rooms");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/rooms/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/rooms", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.patch(`/admin/rooms/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/rooms/${id}`);
    return res.data;
  },
};
