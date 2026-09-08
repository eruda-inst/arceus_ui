"use client";

import { JSX, ReactNode, useEffect } from "react";
import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/stores/auth.store";
import useTokenRefresh from "@/hooks/useTokenRefresh.hook";

export interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  const init = useAuthStore((state) => state.init);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    init();
  }, [init, accessToken]);

  useTokenRefresh({ checkInterval: 30000, thresholdSeconds: 60 });

  return (
    <ThemeProvider attribute="class" enableSystem>
      {children}
      <Toast.Provider />
    </ThemeProvider>
  );
}
