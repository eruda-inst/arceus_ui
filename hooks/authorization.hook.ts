import { useCallback } from "react";
import { usePermissionStore } from "@/stores/perm.store";

export function useAuthorization() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissionStore();

  const checkPermission = useCallback(
    (permissionCode: string) => hasPermission(permissionCode),
    [hasPermission],
  );

  const checkAnyPermission = useCallback(
    (permissionCodes: string[]) => hasAnyPermission(permissionCodes),
    [hasAnyPermission],
  );

  const checkAllPermissions = useCallback(
    (permissionCodes: string[]) => hasAllPermissions(permissionCodes),
    [hasAllPermissions],
  );

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
  };
}
