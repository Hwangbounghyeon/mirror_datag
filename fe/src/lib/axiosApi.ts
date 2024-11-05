import axios from "axios";
import store from "@/store/store";
import { clearAuth, setAccessToken } from "@/store/authSlice";
import { setUserInfo, clearUserInfo } from "@/store/userInfoSlice";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 요청에 대한 인터셉터 처리 - 요청이 이루어질 때마다 실행
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답에 대한 인터셉터 처리
api.interceptors.response.use(
  (response) => response, // 정상 요청 그대로 리턴
  async (error) => {
    const originalRequest = error.config; // 에러가 발생한 요청
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 요청 방지
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok || response.status === 401) {
          clearAuth();
          clearUserInfo();
          return Promise.reject(error);
        }
        const data = await response.json();
        setAccessToken(data.access_token as string);
        return api(originalRequest);
      } catch (error) {
        clearAuth();
        clearUserInfo();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
