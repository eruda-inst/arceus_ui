"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  name: string;
  funcao?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/autenticacao/verify");
      const data = await response.json();

      if (data.valid) {
        // Try to use role/funcao returned by the API, fallback to heuristics
        const funcao =
          data.funcao ??
          data.role ??
          (data.email && data.email.includes("admin")
            ? "administrador"
            : "usuario");
        setUser({
          email: data.email ?? "admin@empresa.com",
          name: data.name ?? "Administrador",
          funcao,
        });
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/autenticacao/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return { user, loading, logout };
}
