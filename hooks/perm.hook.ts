import { useState, useCallback } from "react";
import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { PermissionOut } from "@/types/perm.type";

export function usePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getByUserId = useCallback(
    async (userId: number): Promise<PermissionOut[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(
          API_ROUTES.perm.getByUserId(userId),
        );
        return response.data;
      } catch (err: unknown) {
        setError("Erro ao buscar permissões");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getByGroupId = useCallback(
    async (groupId: number): Promise<PermissionOut[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(
          API_ROUTES.perm.getByGroupId(groupId),
        );
        return response.data;
      } catch (err: unknown) {
        setError("Erro ao buscar permissões do grupo");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    getByUserId,
    getByGroupId,
  };
}
