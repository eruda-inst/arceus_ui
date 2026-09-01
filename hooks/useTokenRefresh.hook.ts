import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authentication.store";
import { getCookie } from "cookies-next";
import { TOKEN_EXPIRY_KEY } from "@/stores/authentication.store";

interface UseTokenRefreshOptions {
  checkInterval?: number;
  thresholdSeconds?: number;
}

export default function useTokenRefresh(options: UseTokenRefreshOptions = {}) {
  const { checkInterval = 30000, thresholdSeconds = 60 } = options;

  const refreshTokens = useAuthStore((state) => state.refreshTokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  const refreshing = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isAuthenticated || !accessToken) return;

    let intervalId: NodeJS.Timeout | null = null;

    const checkAndRefresh = async () => {
      if (refreshing.current) return;

      const expiryStr = getCookie(TOKEN_EXPIRY_KEY) as string | undefined;
      if (!expiryStr) {
        refreshing.current = true;
        await refreshTokens();
        refreshing.current = false;
        return;
      }

      const expiry = new Date(expiryStr).getTime();
      const now = Date.now();
      const timeLeft = (expiry - now) / 1000;

      if (timeLeft <= thresholdSeconds) {
        refreshing.current = true;
        await refreshTokens();
        refreshing.current = false;
      }
    };

    checkAndRefresh();

    intervalId = setInterval(checkAndRefresh, checkInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isAuthenticated,
    accessToken,
    refreshTokens,
    checkInterval,
    thresholdSeconds,
  ]);
}
