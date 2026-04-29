"use client";

import { useEffect, useRef, useCallback } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export const useTokenRefresh = () => {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getCookie(REFRESH_TOKEN_KEY) as string | undefined;

      if (!refreshToken) {
        return false;
      }

      const response = await axios.post<RefreshTokenResponse>(
        API_ROUTES.authentication.refreshToken(),
        {
          refresh_token: refreshToken,
        },
      );

      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = response.data;
      const maxAge = expires_in || 3600;

      // Update access token
      setCookie(ACCESS_TOKEN_KEY, access_token, {
        maxAge,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Update expiry time
      const expiryDate = new Date(Date.now() + maxAge * 1000).toISOString();

      setCookie(TOKEN_EXPIRY_KEY, expiryDate, {
        maxAge,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Update refresh token if a new one is provided
      if (newRefreshToken) {
        setCookie(REFRESH_TOKEN_KEY, newRefreshToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return true;
    } catch {
      // Clear tokens on refresh failure
      deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
      deleteCookie(REFRESH_TOKEN_KEY, { path: "/" });
      deleteCookie(TOKEN_EXPIRY_KEY, { path: "/" });

      return false;
    }
  }, []);

  const getTimeUntilExpiry = useCallback((): number => {
    const expiry = getCookie(TOKEN_EXPIRY_KEY) as string | undefined;

    if (!expiry) return 0;

    const expiryDate = new Date(expiry);
    const now = new Date();

    return expiryDate.getTime() - now.getTime();
  }, []);

  useEffect(() => {
    // Setup automatic token refresh
    const setupRefreshInterval = () => {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      const hasAccessToken = getCookie(ACCESS_TOKEN_KEY);
      const hasRefreshToken = getCookie(REFRESH_TOKEN_KEY);

      if (!hasAccessToken || !hasRefreshToken) {
        return; // No tokens, nothing to refresh
      }

      // Refresh token 5 minutes before expiry
      const checkRefreshNeed = async () => {
        const timeUntilExpiry = getTimeUntilExpiry();
        const refreshBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timeUntilExpiry > 0 && timeUntilExpiry < refreshBuffer) {
          const success = await refreshAccessToken();

          if (!success) {
            // Stop refreshing if it failed
            if (refreshIntervalRef.current) {
              clearInterval(refreshIntervalRef.current);
            }
          }
        }
      };

      // Check every minute if token needs refresh
      refreshIntervalRef.current = setInterval(checkRefreshNeed, 60 * 1000);

      // Check immediately on mount
      checkRefreshNeed();
    };

    setupRefreshInterval();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshAccessToken, getTimeUntilExpiry]);

  return { refreshAccessToken };
};
