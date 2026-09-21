import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_ROUTES } from "@/configs/api.config";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRY_KEY,
} from "@/stores/auth.store";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

interface AxiosClientConfig {
  withCredentials?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const createAxiosClient = (
  defaultConfig?: AxiosClientConfig,
): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000",
    withCredentials: defaultConfig?.withCredentials !== false,
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (config.withCredentials !== false) {
        const accessToken = getCookie(ACCESS_TOKEN_KEY) as string | undefined;

        if (accessToken) {
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _skipAuth?: boolean;
      };

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.withCredentials === false ||
        originalRequest._skipAuth
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          if (originalRequest.headers) {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          }
          return client(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const refreshToken = getCookie(REFRESH_TOKEN_KEY) as
            string | undefined;

          if (!refreshToken) {
            throw new Error("No refresh token");
          }

          const response = await axios.post<RefreshTokenResponse>(
            API_ROUTES.auth.refreshToken(),
            { refresh_token: refreshToken },
            {
              baseURL:
                process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000",
              withCredentials: true,
            },
          );

          const {
            access_token,
            refresh_token: newRefreshToken,
            expires_in,
          } = response.data;

          const cookieOptions = {
            maxAge: expires_in || 3600,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
          };
          setCookie(ACCESS_TOKEN_KEY, access_token, cookieOptions);

          if (newRefreshToken) {
            setCookie(REFRESH_TOKEN_KEY, newRefreshToken, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
              secure: false,
              sameSite: "strict" as const,
            });
          }

          const expiryDate = new Date(
            Date.now() + (expires_in || 3600) * 1000,
          ).toISOString();
          setCookie(TOKEN_EXPIRY_KEY, expiryDate, cookieOptions);

          return access_token;
        } catch (refreshError) {
          deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
          deleteCookie(REFRESH_TOKEN_KEY, { path: "/" });
          deleteCookie(TOKEN_EXPIRY_KEY, { path: "/" });
          redirectToLogin();
          throw refreshError;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        }
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );

  return client;
};

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  }
};

export const axiosClient = createAxiosClient({ withCredentials: true });

export const createCustomAxiosClient = (config?: AxiosClientConfig) => {
  return createAxiosClient(config);
};
