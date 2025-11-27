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

export interface Permissao {
  id: number;
  codigo: string;
  nome: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const redirectIfNoPermission = (permission: string) => {
    if (!hasPermission(permission)) {
      router.push("/forbidden");
      return true;
    }
    return false;
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  // Função para buscar permissões do grupo
  const buscarPermissoes = async (id_grupo: number): Promise<Permissao[]> => {
    try {
      const response = await api.get<Permissao[]>(
        `/api/v1/grupos_permissoes?id_grupo=${id_grupo}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      return [];
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = getCookie("auth-token");

      if (!token) {
        setUser(null);
        setPermissoes([]);
        setLoading(false);
        return;
      }

      const response = await api.get<User>(getHttpUrl(HTTP_ENDPOINTS_NAME.ME));

      if (response.data) {
        setUser(response.data);
        setError(null);

        // Buscar permissões do grupo do usuário
        const permissoesDoGrupo = await buscarPermissoes(
          response.data.id_grupo
        );
        setPermissoes(permissoesDoGrupo);
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      setError("Falha ao carregar dados do usuário");
      setPermissoes([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setPermissoes([]);
      deleteCookie("auth-token");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isAdmin = (): boolean => {
    return user?.id_grupo === 1;
  };

  const hasPermission = (permissionCode: string): boolean => {
    // Administradores têm todas as permissões
    if (isAdmin()) {
      return true;
    }

    // Verificar se a permissão está na lista de permissões do grupo
    return permissoes.some((permissao) => permissao.codigo === permissionCode);
  };

  // Nova função para verificar múltiplas permissões
  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    if (isAdmin()) {
      return true;
    }

    return permissionCodes.some((code) =>
      permissoes.some((permissao) => permissao.codigo === code)
    );
  };

  // Nova função para verificar se tem todas as permissões
  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    if (isAdmin()) {
      return true;
    }

    return permissionCodes.every((code) =>
      permissoes.some((permissao) => permissao.codigo === code)
    );
  };

  // Nova função para obter permissões específicas
  const getPermissions = (): string[] => {
    return permissoes.map((permissao) => permissao.codigo);
  };

  return {
    user,
    permissoes,
    loading,
    error,
    logout,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions,
    checkAuth,
    redirectIfNoPermission,
  };
}

// Evento customizado para notificar sobre mudanças de autenticação
const AUTH_CHANGE_EVENT = "authChange";
