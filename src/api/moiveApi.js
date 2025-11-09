import axios from "axios";

const BASE_URL = "http://localhost:8080/api/movies";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});
const handleError = (error) => {
  console.error("Movie API Error:", error?.response?.data || error.message);
  throw error;
};
export const movieApi = {
  getNew: async (page = 1, version = "v3") => {
    try {
      const res = await apiClient.get("/new", {
        params: { page, version },
      });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getDetail: async (slug) => {
    try {
      const res = await apiClient.get(`/${slug}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getFromTMDB: async (type, id) => {
    try {
      const res = await apiClient.get(`/tmdb/${type}/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getList: async (category, page = 1, limit = 10) => {
    try {
      const res = await apiClient.get(`/list/${category}`, {
        params: { page, limit },
      });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  async search(keyword, page = 1) {
    try {
      const { data } = await axios.get(`${BASE_URL}/search`, {
        params: { keyword, page },
      });
      if (data?.status && Array.isArray(data.result)) {
        return { items: data.result, totalPages: 1 };
      }
      return data?.items || data?.result || [];
    } catch (error) {
      console.error("❌ Search API error:", error);
      return [];
    }
  },
  getGenres: async () => {
    try {
      const res = await apiClient.get("/genres");
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getGenreDetail: async (slug, page = 1) => {
    try {
      const res = await apiClient.get(`/genres/${slug}`, {
        params: { page },
      });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getCountries: async () => {
    try {
      const res = await apiClient.get("/countries");
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getCountryDetail: async (slug, page = 1) => {
    try {
      const res = await apiClient.get(`/countries/${slug}`, {
        params: { page },
      });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },

  getMoviesByYear: async (year, page = 1) => {
    try {
      const res = await apiClient.get(`/years/${year}`, {
        params: { page },
      });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};

export default movieApi;
