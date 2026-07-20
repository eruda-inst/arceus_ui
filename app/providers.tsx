"use client";

import { Toast } from "@heroui/react";
import TokenRefreshProvider from "@/components/TokenRefreshProvider/TokenRefreshProvider";
import { PermissionsInitializer } from "@/components/PermInitializer/PermInitializer";
import { AuthProvider } from "@/contexts/authentication.context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <TokenRefreshProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <PermissionsInitializer />
        </QueryClientProvider>
        <Toast.Provider />
      </AuthProvider>
    </TokenRefreshProvider>
  );
}

export default Providers;
