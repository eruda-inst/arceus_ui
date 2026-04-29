import { useEffect, useState } from "react";
import { usePermissions } from "@/contexts/permissionContext";

export function usePermissionCheck(permissionCode: string) {
  const { hasPermission, isLoading } = usePermissions();
  const [hasPerm, setHasPerm] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasPerm(hasPermission(permissionCode));
    }
  }, [hasPermission, isLoading, permissionCode]);

  return {
    hasPermission: hasPerm,
    isLoading,
  };
}

export function useAnyPermissionCheck(permissionCodes: string[]) {
  const { hasAnyPermission, isLoading } = usePermissions();
  const [hasAnyPerm, setHasAnyPerm] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAnyPerm(hasAnyPermission(permissionCodes));
    }
  }, [hasAnyPermission, isLoading, permissionCodes]);

  return {
    hasAnyPermission: hasAnyPerm,
    isLoading,
  };
}

export function useAllPermissionsCheck(permissionCodes: string[]) {
  const { hasAllPermissions, isLoading } = usePermissions();
  const [hasAllPerms, setHasAllPerms] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAllPerms(hasAllPermissions(permissionCodes));
    }
  }, [hasAllPermissions, isLoading, permissionCodes]);

  return {
    hasAllPermissions: hasAllPerms,
    isLoading,
  };
}
