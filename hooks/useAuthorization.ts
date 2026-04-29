import { useCallback } from "react";
import { usePermissions } from "@/contexts/permissionContext";

export function useAuthorization() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  const checkPermission = useCallback(
    (permissionCode: string): boolean => {
      return hasPermission(permissionCode);
    },
    [hasPermission],
  );

  const checkAnyPermission = useCallback(
    (permissionCodes: string[]): boolean => {
      return hasAnyPermission(permissionCodes);
    },
    [hasAnyPermission],
  );

  const checkAllPermissions = useCallback(
    (permissionCodes: string[]): boolean => {
      return hasAllPermissions(permissionCodes);
    },
    [hasAllPermissions],
  );

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
  };
}
