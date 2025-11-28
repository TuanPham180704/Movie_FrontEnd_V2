import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const ticketApi = {
  getAll: async () => {
    const res = await api.get("/admin/tickets");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/admin/tickets/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`/admin/tickets/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/admin/tickets/${id}`);
    return res.data;
  },
};
