import axios from "axios";
import { API_CONFIG, getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
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

      if (!refreshToken) {
        console.error("No refresh token available.");
        if (typeof window !== "undefined") {
          deleteCookie("auth-token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          getHttpUrl(HTTP_ENDPOINTS_NAME.REFRESH),
          {
            refreshToken,
          }
        );

        // backend may return a new access token and optionally a new refresh token
        const { token: newAccessToken, refreshToken: newRefreshToken } =
          data as any;

        if (newAccessToken) {
          setCookie("auth-token", newAccessToken, {
            path: "/",
            maxAge: 60 * 15, // 15 minutes
            sameSite: "strict",
          });

          if (typeof window !== "undefined" && newRefreshToken) {
            try {
              localStorage.setItem("refreshToken", newRefreshToken);
            } catch (e) {
              console.warn(
                "Could not save new refresh token to localStorage:",
                e
              );
            }
          }

          // ensure headers object exists before setting
          if (!originalRequest.headers) {
            originalRequest.headers = {} as any;
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        // If refresh endpoint didn't provide a new token, force logout
        throw new Error("Refresh endpoint did not return a new access token.");
      } catch (refreshError) {
        console.error("Unable to refresh token:", refreshError);
        if (typeof window !== "undefined") {
          deleteCookie("auth-token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
