import axios from "axios";
import store from "@/store/store";
import { clearAuth, setAccessToken } from "@/store/authSlice";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        return api(originalRequest);
      } catch (error) {
        clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
