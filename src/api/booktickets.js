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

export const movieTicketApi = {
  getAllMovies: async (params) => {
    const res = await api.get("/admin/movies", { params });
    return res.data;
  },
  getMovieById: async (id) => {
    const res = await api.get(`/admin/movies/${id}`);
    return res.data;
  },
  getAllShowtimes: async (params) => {
    const res = await api.get("/admin/showtimes", { params });
    return res.data;
  },
  getShowtimeById: async (id) => {
    const res = await api.get(`/admin/showtimes/${id}`);
    return res.data;
  },

  getAllCinemas: async () => {
    const res = await api.get("/admin/cinemas");
    return res.data;
  },
  getCinemaById: async (id) => {
    const res = await api.get(`/admin/cinemas/${id}`);
    return res.data;
  },

  getAllRooms: async () => {
    const res = await api.get("/admin/rooms");
    return res.data;
  },
  getRoomById: async (id) => {
    const res = await api.get(`/admin/rooms/${id}`);
    return res.data;
  },

  getSeatsByRoomId: async (roomId) => {
    const res = await api.get(`/admin/rooms/${roomId}/seats`);
    return res.data;
  },
};
