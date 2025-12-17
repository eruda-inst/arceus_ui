"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Users, X, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloPagina } from "@/hooks/useTituloPagina";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import HeaderPagina from "@/ui/HeaderPagina/HeaderPagina";
import TituloPagina from "@/ui/TituloPagina/TituloPagina";
import DescricaoPagina from "@/ui/DescricaoPagina/DescricaoPagina";

interface Grupo {
  id: number;
  nome: string;
  criado_em: string;
  atualizado_em: string;
}

interface Permissao {
  id: number;
  codigo: string;
  nome: string;
}

interface GrupoComPermissoes extends Grupo {
  permissoes: Permissao[];
}

export default function Permissoes() {
  useTituloPagina({ titulo: "Absol · Permissões" });
  const { hasPermission, redirectIfNoPermission, loading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GrupoComPermissoes | null>(
    null,
  );
  const [selectedPermission, setSelectedPermission] =
    useState<Permissao | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<Permissao[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<GrupoComPermissoes[]>(
    [],
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("grupos:ver");
    }
  }, [loading, redirectIfNoPermission]);

  // Buscar todos os grupos com suas permissões
  const {
    data: gruposComPermissoes,
    isLoading,
    isError,
  } = useQuery<GrupoComPermissoes[]>({
    queryKey: ["grupos-permissoes"],
    queryFn: async () => {
      // Buscar todos os grupos
      const gruposResponse = await api.get<Grupo[]>(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS)}?itens_por_pagina=100`,
      );
      const grupos = gruposResponse.data;

      // Para cada grupo, buscar suas permissões
      const gruposCompleto = await Promise.all(
        grupos.map(async (grupo) => {
          try {
            const permissoesResponse = await api.get<Permissao[]>(
              `/api/v1/grupos_permissoes/id/${grupo.id}`,
            );
            return {
              ...grupo,
              permissoes: permissoesResponse.data,
            };
          } catch (error) {
            return {
              ...grupo,
              permissoes: [],
            };
          }
        }),
      );

      return gruposCompleto;
    },
    retry: false,
  });

  // Buscar todas as permissões disponíveis
  const { data: todasPermissoes } = useQuery<Permissao[]>({
    queryKey: ["todas-permissoes"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.PERMISSOES)}?itens_por_pagina=100`,
      );
      return response.data;
    },
    enabled: hasPermission("permissoes:ver"),
  });

  // Filtrar grupos baseado na busca
  useEffect(() => {
    if (gruposComPermissoes) {
      const filtered = gruposComPermissoes.filter((grupo) => {
        const matchesNome = grupo.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesPermissoes = grupo.permissoes.some(
          (p) =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return matchesNome || matchesPermissoes;
      });
      setFilteredGroups(filtered);
    }
  }, [gruposComPermissoes, searchTerm]);

  const handleAddPermission = (grupo: GrupoComPermissoes) => {
    setSelectedGroup(grupo);
    // Filtrar permissões que ainda não estão no grupo
    if (todasPermissoes) {
      const disponiveis = todasPermissoes.filter(
        (permissao) => !grupo.permissoes.some((p) => p.id === permissao.id),
      );
      setAvailablePermissions(disponiveis);
    }
    setIsAddDialogOpen(true);
  };

  const handleRemovePermission = (
    grupo: GrupoComPermissoes,
    permissao: Permissao,
  ) => {
    setSelectedGroup(grupo);
    setSelectedPermission(permissao);
    setIsRemoveDialogOpen(true);
  };

  const handleAddPermissionConfirm = async (permissao: Permissao) => {
    if (!selectedGroup || !hasPermission("grupos_permissoes:adicionar")) return;

    try {
      await api.post(
        `/api/v1/grupos_permissoes/id/${selectedGroup.id}/${permissao.id}`,
      );
      queryClient.invalidateQueries({ queryKey: ["grupos-permissoes"] });
      setIsAddDialogOpen(false);
      setSelectedGroup(null);
      toast.success("Sucesso!", {
        position: "top-center",
        description: `Permissão ${permissao.nome} adicionada ao grupo ${selectedGroup.nome}`,
      });
    } catch (error: any) {
      console.error("Erro ao adicionar permissão:", error);
      toast.error("Erro", {
        position: "top-center",
        description:
          error.response?.data?.detail || "Erro ao adicionar permissão",
      });
    }
  };

  const handleRemovePermissionConfirm = async () => {
    if (
      !selectedGroup ||
      !selectedPermission ||
      !hasPermission("grupos_permissoes:excluir")
    )
      return;

    try {
      await api.delete(
        `/api/v1/grupos_permissoes/id/${selectedGroup.id}/${selectedPermission.id}`,
      );
      queryClient.invalidateQueries({ queryKey: ["grupos-permissoes"] });
      setIsRemoveDialogOpen(false);
      setSelectedGroup(null);
      setSelectedPermission(null);
      toast.success("Sucesso!", {
        position: "top-center",
        description: `Permissão removida do grupo ${selectedGroup.nome}`,
      });
    } catch (error: any) {
      console.error("Erro ao remover permissão:", error);
      toast.error("Erro", {
        position: "top-center",
        description:
          error.response?.data?.detail || "Erro ao remover permissão",
      });
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoriaPermissao = (codigo: string) => {
    const partes = codigo.split(":");
    return partes[0] || "geral";
  };

  const agruparPermissoesPorCategoria = (permissoes: Permissao[]) => {
    const agrupadas: Record<string, Permissao[]> = {};

    permissoes.forEach((permissao) => {
      const categoria = getCategoriaPermissao(permissao.codigo);
      if (!agrupadas[categoria]) {
        agrupadas[categoria] = [];
      }
      agrupadas[categoria].push(permissao);
    });

    return agrupadas;
  };

  if (!hasPermission("grupos:ver")) {
    return null;
  }

  return (
    <div
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px)",
      }}
      className="relative"
    >
      <HeaderPagina>
        <div>
          <TituloPagina>Permissões por Grupo</TituloPagina>
          <DescricaoPagina>
            Gerencie as permissões de cada grupo do sistema
          </DescricaoPagina>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Input
              placeholder="Buscar grupo ou permissão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </HeaderPagina>

      {isLoading ? (
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </Grid>
      ) : isError ? (
        <Mensagem className="text-destructive">
          Erro ao carregar grupos e permissões
        </Mensagem>
      ) : filteredGroups && filteredGroups.length > 0 ? (
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {filteredGroups.map((grupo) => {
            const permissoesAgrupadas = agruparPermissoesPorCategoria(
              grupo.permissoes,
            );

            return (
              <motion.div
                key={grupo.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", bounce: 0 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {grupo.nome}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {grupo.permissoes.length} permissão
                          {grupo.permissoes.length !== 1 ? "es" : ""}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        ID: {grupo.id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 min-h-0">
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                      {Object.entries(permissoesAgrupadas).length > 0 ? (
                        Object.entries(permissoesAgrupadas).map(
                          ([categoria, permissoes]) => (
                            <div key={categoria} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-muted-foreground capitalize">
                                  {categoria}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {permissoes.length}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {permissoes.map((permissao) => (
                                  <Badge
                                    key={permissao.id}
                                    variant="outline"
                                    className="group relative pr-6"
                                  >
                                    <div
                                      className="truncate max-w-30"
                                      title={`${permissao.nome} (${permissao.codigo})`}
                                    >
                                      {permissao.nome}
                                    </div>
                                    {hasPermission(
                                      "grupos_permissoes:excluir",
                                    ) && (
                                      <button
                                        onClick={() =>
                                          handleRemovePermission(
                                            grupo,
                                            permissao,
                                          )
                                        }
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                  </Badge>
                                ))}
                              </div>
                              <Separator />
                            </div>
                          ),
                        )
                      ) : (
                        <Mensagem className="text-sm text-muted-foreground">
                          Nenhuma permissão atribuída
                        </Mensagem>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="space-y-1">
                          <div>Criado: {formatarData(grupo.criado_em)}</div>
                          <div>
                            Atualizado: {formatarData(grupo.atualizado_em)}
                          </div>
                        </div>
                        {hasPermission("grupos_permissoes:adicionar") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={() => handleAddPermission(grupo)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum grupo encontrado
          {searchTerm && ` para "${searchTerm}"`}
        </Mensagem>
      )}

      {/* Diálogo para adicionar permissão */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Adicionar Permissão ao Grupo {selectedGroup?.nome}
            </DialogTitle>
            <DialogDescription>
              Selecione uma permissão para adicionar ao grupo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {availablePermissions.length > 0 ? (
              availablePermissions.map((permissao) => (
                <div
                  key={permissao.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{permissao.nome}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {permissao.codigo}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddPermissionConfirm(permissao)}
                    className="hover:cursor-pointer"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              ))
            ) : (
              <Mensagem className="text-muted-foreground">
                Todas as permissões já estão atribuídas a este grupo
              </Mensagem>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para remover permissão */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Permissão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a permissão{" "}
              <strong>{selectedPermission?.nome}</strong> (
              <code>{selectedPermission?.codigo}</code>) do grupo{" "}
              <strong>{selectedGroup?.nome}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemovePermissionConfirm}
            >
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Permissoes.displayName = "Permissoes";
