import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMovies = async (page = 1, limit = 5, search = "") => {
  const response = await api.get("/admin/movies", {
    params: { page, limit, search },
  });
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post("/admin/movies", movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.patch(`/admin/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/admin/movies/${id}`);
  return response.data;
};
