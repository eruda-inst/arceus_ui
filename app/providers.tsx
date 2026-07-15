"use client";

import { Toast } from "@heroui/react";
import TokenRefreshProvider from "@/components/TokenRefreshProvider/TokenRefreshProvider";
import { PermissionsProvider } from "@/contexts/perm.context";
import { AuthProvider } from "@/contexts/authentication.context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <TokenRefreshProvider>
      <AuthProvider>
        <PermissionsProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <Toast.Provider />
        </PermissionsProvider>
      </AuthProvider>
    </TokenRefreshProvider>
  );
}

export default Providers;
