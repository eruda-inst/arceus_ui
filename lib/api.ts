import axios from "axios";
import { API_CONFIG } from "@/config/config";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const api = axios.create({
  baseURL: API_CONFIG.HTTP.URL_BASE,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie("auth-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (refreshToken) {
        try {
          const { data } = await axios.post(API_CONFIG.HTTP.ROTAS.REFRESH, {
            refreshToken,
          });

          const { token: newAccessToken } = data;

          setCookie("auth-token", newAccessToken, {
            path: "/",
            maxAge: 60 * 15, // 15 minutes
            sameSite: "strict",
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Unable to refresh token:", refreshError);
          if (typeof window !== "undefined") {
            deleteCookie("auth-token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        console.error("No refresh token available.");
        if (typeof window !== "undefined") {
          deleteCookie("auth-token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
