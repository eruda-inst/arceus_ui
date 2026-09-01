"use client";

import { Toast } from "@heroui/react";
import { PermInitializer } from "@/components/PermInitializer";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/authentication.store";
import useTokenRefresh from "@/hooks/useTokenRefresh.hook";
import { ThemeProvider } from "next-themes";

function Providers({ children }: { children: ReactNode }) {
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
      <PermInitializer />
      <Toast.Provider />
    </ThemeProvider>
  );
}

export default Providers;
