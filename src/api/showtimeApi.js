import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const showtimeApi = {
  getAll: async () => {
    const res = await api.get("/admin/showtimes");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/admin/showtimes/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/admin/showtimes", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/admin/showtimes/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/admin/showtimes/${id}`);
    return res.data;
  },
};
