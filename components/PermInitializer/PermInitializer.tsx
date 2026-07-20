"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authentication.store";
import { usePermissionStore } from "@/stores/perm.store";

export function PermissionsInitializer() {
  const { currentUser, accessToken } = useAuthStore();
  const { setUserId, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    if (currentUser?.id && accessToken) {
      setUserId(currentUser.id);
      fetchPermissions(currentUser.id);
    } else {
      setUserId(null);
    }
  }, [currentUser, accessToken, setUserId, fetchPermissions]);

  return null;
}
