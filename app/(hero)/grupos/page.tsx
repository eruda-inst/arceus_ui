"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Users,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Search,
} from "lucide-react";
import { useTituloPaginaSimples } from "@/hooks/useTituloPagina";
import { toast } from "sonner";
import HeaderPagina from "@/ui/HeaderPagina/HeaderPagina";
import TituloPagina from "@/ui/TituloPagina/TituloPagina";
import DescricaoPagina from "@/ui/DescricaoPagina/DescricaoPagina";
import { Label } from "@/components/ui/label";
import { NomeGrupos } from "@/types/grupo";
import { formatarData, formatarDataHora } from "@/helpers/formatar";

interface Grupo {
  id: number;
  nome: NomeGrupos;
  criado_em: string;
  atualizado_em: string;
}

interface GrupoFormData {
  nome: NomeGrupos | string;
}

export default function Grupos() {
  useTituloPaginaSimples("Absol · Grupos");
  const { hasPermission, redirectIfNoPermission, loading } = useAuth();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Grupo[]>([]);
  const [formData, setFormData] = useState<GrupoFormData>({ nome: "" });
  const [formErrors, setFormErrors] = useState<Partial<GrupoFormData>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("grupos:ver");
    }
  }, [loading, redirectIfNoPermission]);

  // Buscar todos os grupos
  const {
    data: grupos,
    isLoading,
    isError,
    error,
  } = useQuery<Grupo[]>({
    queryKey: ["grupos"],
    queryFn: async () => {
      const response = await api.get<Grupo[]>(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS)}?itens_por_pagina=100`,
      );
      return response.data;
    },
    retry: false,
  });

  // Filtrar grupos baseado na busca
  useEffect(() => {
    if (grupos) {
      const filtered = grupos.filter((grupo) =>
        grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredGroups(filtered);
    }
  }, [grupos, searchTerm]);

  // Mutation para criar grupo
  const createMutation = useMutation({
    mutationFn: async (data: GrupoFormData) => {
      const response = await api.post(
        getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS),
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Grupo criado com sucesso!", {
        position: "top-center",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar grupo:", error);
      toast.error("Erro", {
        position: "top-center",
        description: error.response?.data?.detail || "Erro ao criar grupo",
      });
    },
  });

  // Mutation para atualizar grupo
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GrupoFormData }) => {
      const response = await api.patch(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS)}${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      resetForm();
      toast.success("Grupo atualizado com sucesso!", {
        position: "top-center",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar grupo:", error);
      toast.error("Erro", {
        position: "top-center",
        description: error.response?.data?.detail || "Erro ao atualizar grupo",
      });
    },
  });

  // Mutation para excluir grupo
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${getHttpUrl(HTTP_ENDPOINTS_NAME.GRUPOS)}${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      toast.success("Grupo excluído com sucesso!", {
        position: "top-center",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir grupo:", error);
      toast.error("Erro", {
        position: "top-center",
        description: error.response?.data?.detail || "Erro ao excluir grupo",
      });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createMutation.mutate(formData);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup && validateForm()) {
      updateMutation.mutate({ id: selectedGroup.id, data: formData });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedGroup) {
      deleteMutation.mutate(selectedGroup.id);
    }
  };

  const handleEditClick = (grupo: Grupo) => {
    setSelectedGroup(grupo);
    setFormData({ nome: grupo.nome });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (grupo: Grupo) => {
    setSelectedGroup(grupo);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<GrupoFormData> = {};

    if (!formData.nome.trim()) {
      errors.nome = "O nome do grupo é obrigatório";
    } else if (formData.nome.length < 2) {
      errors.nome = "O nome deve ter pelo menos 2 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({ nome: "" });
    setFormErrors({});
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
          <TituloPagina>Grupos</TituloPagina>
          <DescricaoPagina>
            Gerencie os grupos de usuários do sistema
          </DescricaoPagina>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Input
              placeholder="Buscar grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {hasPermission("grupos:adicionar") && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="hover:cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Grupo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo grupo de usuários.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Grupo</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Administrador"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className={formErrors.nome ? "border-destructive" : ""}
                    />
                    {formErrors.nome && (
                      <p className="text-sm text-destructive">
                        {formErrors.nome}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Criando..." : "Criar Grupo"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </HeaderPagina>

      {isLoading ? (
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </Grid>
      ) : isError ? (
        <Mensagem className="text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar grupos"}
        </Mensagem>
      ) : filteredGroups && filteredGroups.length > 0 ? (
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((grupo) => (
            <motion.div
              key={grupo.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", bounce: 0 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{grupo.nome}</CardTitle>
                        <CardDescription className="mt-1">
                          ID: {grupo.id}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      Grupo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em:</span>
                        <span className="font-medium text-foreground">
                          {formatarData(grupo.criado_em)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Atualizado em:</span>
                        <span className="font-medium text-foreground">
                          {formatarData(grupo.atualizado_em)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-muted-foreground">
                      Detalhes: {formatarDataHora(grupo.criado_em)}
                    </div>
                    <div className="flex gap-2">
                      {hasPermission("grupos:atualizar") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 hover:cursor-pointer"
                          onClick={() => handleEditClick(grupo)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {hasPermission("grupos:excluir") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:border-destructive hover:cursor-pointer"
                          onClick={() => handleDeleteClick(grupo)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          {searchTerm
            ? `Nenhum grupo encontrado para "${searchTerm}"`
            : "Nenhum grupo cadastrado"}
        </Mensagem>
      )}

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Altere os dados do grupo {selectedGroup?.nome}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome do Grupo</Label>
              <Input
                id="edit-nome"
                placeholder="Ex: Administrador"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className={formErrors.nome ? "border-destructive" : ""}
              />
              {formErrors.nome && (
                <p className="text-sm text-destructive">{formErrors.nome}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo{" "}
              <strong>{selectedGroup?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

Grupos.displayName = "Grupos";
