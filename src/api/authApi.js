import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const loginApi = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerApi = async ({ username, email, password }) => {
  const res = await axios.post(`${API_URL}/auth/register`, {
    username,
    email,
    password,
  });
  return res.data;
};

export const getProfileApi = async (token) => {
  const res = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfileApi = async (
  token,
  { username, email, gender, avatar_url }
) => {
  const res = await axios.put(
    `${API_URL}/auth/me`,
    { username, email, gender, avatar_url },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res.data;
};

export const resetPasswordApi = async (token, newPassword, confirmPassword) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, {
    token,
    newPassword,
    confirmPassword,
  });
  return res.data;
};

export const changePasswordApi = async (
  token,
  { oldPassword, newPassword, confirmPassword }
) => {
  const res = await axios.put(
    `${API_URL}/auth/change-password`,
    { oldPassword, newPassword, confirmPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
