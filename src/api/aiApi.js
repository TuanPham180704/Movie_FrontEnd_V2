import axios from "axios";
const AI_URL = "http://localhost:8080/api/ai";

export const askAI = async (message) => {
  const { data } = await axios.post(`${AI_URL}/suggest`, { message });
  return data;
};
