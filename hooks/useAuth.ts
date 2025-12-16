import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { getCookie, deleteCookie } from "cookies-next";
import api from "@/lib/api";
import { GrupoUsuario } from "@/types/grupo";

export interface User {
  id: number;
  email: string;
  ativo: boolean;
  nome: string;
  criado_em: string;
  nome_grupo: string;
}

export interface Grupo {
  id: number;
  nome: string;
  criado_em: string;
  atualizado_em: string;
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

  const buscarGrupoPorNome = async (
    nome_grupo: string,
  ): Promise<Grupo | null> => {
    try {
      const response = await api.get<Grupo>(
        `/api/v1/grupos/nome/${nome_grupo}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar grupo:", error);
      return null;
    }
  };

  const buscarPermissoes = async (nome_grupo: string): Promise<Permissao[]> => {
    try {
      const response = await api.get<Permissao[]>(
        `/api/v1/grupos_permissoes/nome/${nome_grupo}`,
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

        const permissoesDoGrupo = await buscarPermissoes(
          response?.data?.nome_grupo?.toLowerCase(),
        );
        setPermissoes(permissoesDoGrupo);
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação:", err);
      setError("Falha ao carregar dados do usuário");
      setUser(null);
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
    return user?.nome_grupo?.toLowerCase() === GrupoUsuario.Administrador;
  };

  const hasPermission = (permissionCode: string): boolean => {
    return permissoes.some((permissao) => permissao.codigo === permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) =>
      permissoes.some((permissao) => permissao.codigo === code),
    );
  };

  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) =>
      permissoes.some((permissao) => permissao.codigo === code),
    );
  };

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
    buscarGrupoPorNome,
  };
}

const AUTH_CHANGE_EVENT = "authChange";
