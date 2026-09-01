"use client";

import { Toast } from "@heroui/react";
import { PermInitializer } from "@/components/PermInitializer";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authentication.store";
import useTokenRefresh from "@/hooks/useTokenRefresh.hook";

function Providers({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((state) => state.init);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initAuth();
      setIsReady(true);
    };
    initialize();
  }, [initAuth, accessToken]);

  useTokenRefresh({
    checkInterval: 30000,
    thresholdSeconds: 60,
  });

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      {children}
      <PermInitializer />
      <Toast.Provider />
    </>
  );
}

export default Providers;
