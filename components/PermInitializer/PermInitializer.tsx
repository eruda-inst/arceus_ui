"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authentication.store";
import { usePermStore } from "@/stores/perm.store";

export function PermInitializer() {
  const { currentUser, accessToken } = useAuthStore();
  const { setUserId, fetchPerms } = usePermStore();

  useEffect(() => {
    if (currentUser?.id && accessToken) {
      setUserId(currentUser.id);
      fetchPerms(currentUser.id);
    } else {
      setUserId(null);
    }
  }, [currentUser, accessToken, setUserId, fetchPerms]);

  return null;
}
