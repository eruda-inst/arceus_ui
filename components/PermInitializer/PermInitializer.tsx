"use client";

import { useEffect } from "react";
import { useAuthentication } from "@/hooks/authentication.hook";
import { usePermissionStore } from "@/stores/perm.store";

export function PermissionsInitializer() {
  const { currentUser } = useAuthentication();
  const { setUserId, fetchPermissions, reset } = usePermissionStore();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
      fetchPermissions(currentUser.id);
    } else {
      reset();
    }
  }, [currentUser, setUserId, fetchPermissions, reset]);

  return null;
}
