import { useCallback } from "react";
import { usePermStore } from "@/stores/perm.store";

export function useAuthorization() {
  const { hasPerm, hasAnyPerm, hasAllPerms } =
    usePermStore();

  const checkPerm = useCallback(
    (permCode: string) => hasPerm(permCode),
    [hasPerm],
  );

  const checkAnyPerm = useCallback(
    (permCodes: string[]) => hasAnyPerm(permCodes),
    [hasAnyPerm],
  );

  const CheckAllPerms = useCallback(
    (permCodes: string[]) => hasAllPerms(permCodes),
    [hasAllPerms],
  );

  return {
    checkPerm,
    checkAnyPerm,
    CheckAllPerms,
  };
}
