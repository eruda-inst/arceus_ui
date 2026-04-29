"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "@/hooks/useAuthentication";
import { usePermission } from "@/hooks/usePermission";
import { PermissionOut } from "@/types/permissionType";

interface PermissionsContextType {
  permissions: PermissionOut[];
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  hasAllPermissions: (permissionCodes: string[]) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  isLoading: false,
  error: null,
  refreshPermissions: async () => {},
});

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuthentication();
  const { getByUserId } = usePermission();
  const [permissions, setPermissions] = useState<PermissionOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      try {
        const perms = await getByUserId(currentUser.id);
        setPermissions(perms);
      } catch {
        setError("Erro ao buscar permissões");
      } finally {
        setIsLoading(false);
      }
    } else {
      setPermissions([]);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [currentUser]);

  const hasPermission = (permissionCode: string) => {
    return permissions.some((perm) => perm.codigo === permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]) => {
    return permissionCodes.some((code) => hasPermission(code));
  };

  const hasAllPermissions = (permissionCodes: string[]) => {
    return permissionCodes.every((code) => hasPermission(code));
  };

  const refreshPermissions = async () => {
    await fetchPermissions();
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isLoading,
        error,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionsContext);
