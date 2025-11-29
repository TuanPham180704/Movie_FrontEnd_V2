import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const movieApiAdmin = {
  getAll: async (page = 1, limit = 5, search = "") => {
    const res = await api.get("/admin/movies", {
      params: { page, limit, search },
    });
    return res.data;
  },

  create: async (movieData) => {
    const res = await api.post("/admin/movies", movieData);
    return res.data;
  },

  update: async (id, movieData) => {
    const res = await api.patch(`/admin/movies/${id}`, movieData);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/admin/movies/${id}`);
    return res.data;
  },
};
