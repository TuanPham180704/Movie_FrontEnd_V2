import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // giả sử bạn lưu token ở localStorage
  },
});

// Lấy danh sách người dùng
export const getUsers = async (search = "") => {
  const res = await api.get(`/admin/users?search=${search}`);
  return res.data;
};

// Lấy 1 user
export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

// Update user
export const updateUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}`, data);
  return res.data;
};

// Khóa / mở khóa
export const lockUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}/lock`, data);
  return res.data;
};

// Xóa mềm user
export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};
