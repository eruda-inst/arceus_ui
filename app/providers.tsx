"use client";

import { Toast } from "@heroui/react";
import TokenRefreshProvider from "@/components/TokenRefreshProvider/TokenRefreshProvider";
import { PermissionsProvider } from "@/contexts/permissionContext";
import { AuthProvider } from "@/contexts/authenticationContext";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TokenRefreshProvider>
      <AuthProvider>
        <PermissionsProvider>
          {children}
          <Toast.Provider />
        </PermissionsProvider>
      </AuthProvider>
    </TokenRefreshProvider>
  );
}

export default Providers;
