import { useEffect, useState } from "react";
import { usePermissionStore } from "@/stores/perm.store";

export function usePermissionCheck(permissionCode: string) {
  const { hasPermission, isLoading } = usePermissionStore();
  const [hasPerm, setHasPerm] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasPerm(hasPermission(permissionCode));
    }
  }, [hasPermission, isLoading, permissionCode]);

  return { hasPermission: hasPerm, isLoading };
}

export function useAnyPermissionCheck(permissionCodes: string[]) {
  const { hasAnyPermission, isLoading } = usePermissionStore();
  const [hasAnyPerm, setHasAnyPerm] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAnyPerm(hasAnyPermission(permissionCodes));
    }
  }, [hasAnyPermission, isLoading, permissionCodes]);

  return { hasAnyPermission: hasAnyPerm, isLoading };
}

export function useAllPermissionsCheck(permissionCodes: string[]) {
  const { hasAllPermissions, isLoading } = usePermissionStore();
  const [hasAllPerms, setHasAllPerms] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAllPerms(hasAllPermissions(permissionCodes));
    }
  }, [hasAllPermissions, isLoading, permissionCodes]);

  return { hasAllPermissions: hasAllPerms, isLoading };
}
