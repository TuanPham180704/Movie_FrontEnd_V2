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

export const getUsers = async ({ page, limit, search }) => {
  const res = await api.get(`/admin/users`, {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}`, data);
  return res.data;
};

export const lockUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}/lock`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};
