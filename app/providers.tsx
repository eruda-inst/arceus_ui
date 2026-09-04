"use client";

import { ReactNode, useEffect } from "react";
import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/stores/auth.store";
import useTokenRefresh from "@/hooks/useTokenRefresh.hook";

export default function Providers({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((state) => state.init);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const initialize = async () => {
      await initAuth();
    };
    initialize();
  }, [initAuth, accessToken]);

  useTokenRefresh({
    checkInterval: 30000,
    thresholdSeconds: 60,
  });

  return (
    <ThemeProvider attribute="class" enableSystem>
      {children}
      <Toast.Provider />
    </ThemeProvider>
  );
}
