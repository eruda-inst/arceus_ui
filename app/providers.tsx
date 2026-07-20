"use client";

import { Toast } from "@heroui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PermissionsInitializer } from "@/components/PermInitializer/PermInitializer";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authentication.store";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
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

  if (!isReady) {
    return <></>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <PermissionsInitializer />
      <Toast.Provider />
    </QueryClientProvider>
  );
}

export default Providers;
