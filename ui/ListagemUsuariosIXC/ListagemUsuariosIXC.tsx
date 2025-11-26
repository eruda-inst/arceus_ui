"use client";

import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { obterTokenAutenticacao } from "@/helpers/misc";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, User, Mail, UserCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { useMemo, useState } from "react";

interface UsuarioIXC {
  id: number;
  email: string;
  nome: string;
}

interface UsuariosIXC {
  usuarios_ixc: UsuarioIXC[];
}

interface Props {
  selectedId?: number | null;
  onSelect?: (usuario: UsuarioIXC) => void;
  existingEmails?: string[];
}

export function ListagemUsuariosIXC({
  selectedId,
  onSelect,
  existingEmails = [],
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isError, isLoading } = useQuery<UsuariosIXC>({
    queryKey: ["usuariosIXC"],
    queryFn: async () => {
      const token = obterTokenAutenticacao();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS_IXC)}?itens_por_pagina=100`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    retry: false,
  });

  const filteredUsers = useMemo(() => {
    if (!data?.usuarios_ixc) return [];

    const existingSet = new Set(existingEmails.filter(Boolean));
    const availableUsers = data.usuarios_ixc.filter(
      (u) => !existingSet.has(u.email)
    );

    if (!searchTerm.trim()) {
      return availableUsers.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    const term = searchTerm.toLowerCase();
    return availableUsers
      .filter(
        (u) =>
          u.nome.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      )
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [data?.usuarios_ixc, existingEmails, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            Carregando usuários...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Mensagem className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Erro ao carregar usuários do IXC
      </Mensagem>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contador de resultados */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{filteredUsers.length} usuário(s) disponível(s)</span>
        {existingEmails.length > 0 && (
          <span>{existingEmails.length} já adicionado(s)</span>
        )}
      </div>

      {/* Lista de usuários */}
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <>
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum usuário encontrado para "{searchTerm}"</p>
                  <p className="text-sm">Tente ajustar os termos da busca</p>
                </>
              ) : (
                <>
                  <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Todos os usuários já foram adicionados</p>
                </>
              )}
            </div>
          ) : (
            filteredUsers.map((usuarioIXC) => {
              const isSelected = selectedId === usuarioIXC.id;

              return (
                <motion.div
                  key={usuarioIXC.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer",
                      "hover:border-primary hover:bg-accent/50",
                      isSelected
                        ? "border-primary bg-accent shadow-sm"
                        : "border-transparent bg-card"
                    )}
                    onClick={() => onSelect?.(usuarioIXC)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={cn(
                            "p-2 rounded-full mt-1",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <User className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {usuarioIXC.nome}
                            </p>
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Selecionado
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{usuarioIXC.email}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              ID: {usuarioIXC.id}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

ListagemUsuariosIXC.displayName = "ListagemUsuariosIXC";
