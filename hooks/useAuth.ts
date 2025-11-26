"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { getCookie, deleteCookie } from "cookies-next";
import api from "@/lib/api";

export interface User {
  id: number;
  email: string;
  ativo: boolean;
  nome: string;
  criado_em: string;
  id_grupo: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getCookie("auth-token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get<User>(getHttpUrl(HTTP_ENDPOINTS_NAME.ME));

      if (response.data) {
        setUser(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      setError("Falha ao carregar dados do usuário");
      // Clear invalid token
      deleteCookie("auth-token");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      deleteCookie("auth-token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isAdmin = (): boolean => {
    return user?.id_grupo === 1;
  };

  const hasPermission = (permissionCode: string): boolean => {
    // For now, admins have all permissions
    if (isAdmin()) {
      return true;
    }
    // TODO: Implement role-based permission checking when available
    return false;
  };

  return { user, loading, error, logout, isAdmin, hasPermission };
}
