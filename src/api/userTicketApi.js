import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
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
export const userTicketApi = {
  getAll: async () => {
    const res = await api.get("/user/tickets");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/user/tickets/${id}`);
    return res.data;
  },

  book: async (data) => {
    const res = await api.post("/user/tickets", data);
    return res.data;
  },

  pay: async (id) => {
    const res = await api.patch(`/user/tickets/pay/${id}`);
    return res.data;
  },
};
