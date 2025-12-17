"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloPaginaSimples } from "@/hooks/useTituloPagina";
import HeaderPagina from "@/ui/HeaderPagina/HeaderPagina";
import TituloPagina from "@/ui/TituloPagina/TituloPagina";
import DescricaoPagina from "@/ui/DescricaoPagina/DescricaoPagina";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Agente {
  id: number;
  nome: string;
  setor: string;
  descricao: string;
  criado_em: string;
  atualizado_em: string;
  configuracao: string;
}

interface AgenteFormData {
  nome: string;
  setor: string;
  descricao: string;
  configuracao: File | null;
}

export default function Agentes() {
  useTituloPaginaSimples("Absol · Agentes");
  const { hasPermission, redirectIfNoPermission, loading } = useAuth();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);
  const [formData, setFormData] = useState<AgenteFormData>({
    nome: "",
    setor: "",
    descricao: "",
    configuracao: null,
  });

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("agentes:ver");
    }
  }, [loading, redirectIfNoPermission]);

  const { data, isLoading, isError } = useQuery<Agente[]>({
    queryKey: ["agentes"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.AGENTES)}?itens_por_pagina=100`,
      );
      return response.data;
    },
    retry: false,
  });

  const adicionarAgenteMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(
        getHttpUrl(HTTP_ENDPOINTS_NAME.AGENTES),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentes"] });
      setIsAddModalOpen(false);
      resetForm();
      toast.success("Agente adicionado", {
        position: "top-center",
        description: "Agente criado com sucesso.",
      });
    },
    onError: () => {
      toast.error("Erro", {
        position: "top-center",
        description: "Falha ao adicionar agente.",
      });
    },
  });

  const atualizarAgenteMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await api.patch(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.AGENTES)}${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentes"] });
      setIsEditModalOpen(false);
      resetForm();
      toast.success("Agente atualizado", {
        position: "top-center",
        description: "Agente atualizado com sucesso.",
      });
    },
    onError: () => {
      toast.error("Erro", {
        position: "top-center",
        description: "Falha ao atualizar agente.",
      });
    },
  });

  const excluirAgenteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${getHttpUrl(HTTP_ENDPOINTS_NAME.AGENTES)}${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentes"] });
      setIsDeleteModalOpen(false);
      toast.success("Agente excluído", {
        position: "top-center",
        description: "Agente excluído com sucesso.",
      });
    },
    onError: () => {
      toast.error("Erro", {
        position: "top-center",
        description: "Falha ao excluir agente.",
      });
    },
  });

  const handleDownloadConfig = (agente: Agente) => {
    const blob = new Blob([agente.configuracao], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `config-agente-${agente.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, configuracao: file }));
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      setor: "",
      descricao: "",
      configuracao: null,
    });
    setSelectedAgente(null);
  };

  const handleAddAgente = () => {
    if (!formData.nome || !formData.setor || !formData.configuracao) {
      toast.warning("Campos obrigatórios", {
        position: "top-center",
        description: "Nome, setor e configuração são obrigatórios.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nome", formData.nome);
    formDataToSend.append("setor", formData.setor);
    formDataToSend.append("descricao", formData.descricao);
    formDataToSend.append("configuracao", formData.configuracao);

    adicionarAgenteMutation.mutate(formDataToSend);
  };

  const handleEditAgente = () => {
    if (!selectedAgente) return;

    const formDataToSend = new FormData();
    if (formData.nome) formDataToSend.append("nome", formData.nome);
    if (formData.setor) formDataToSend.append("setor", formData.setor);
    if (formData.descricao !== undefined)
      formDataToSend.append("descricao", formData.descricao);
    if (formData.configuracao)
      formDataToSend.append("configuracao", formData.configuracao);

    atualizarAgenteMutation.mutate({
      id: selectedAgente.id,
      formData: formDataToSend,
    });
  };

  const handleDeleteAgente = () => {
    if (!selectedAgente) return;
    excluirAgenteMutation.mutate(selectedAgente.id);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openEditModal = (agente: Agente) => {
    setSelectedAgente(agente);
    setFormData({
      nome: agente.nome,
      setor: agente.setor,
      descricao: agente.descricao,
      configuracao: null,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (agente: Agente) => {
    setSelectedAgente(agente);
    setIsDeleteModalOpen(true);
  };

  if (!hasPermission("agentes:ver")) {
    return null;
  }

  return (
    <div
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px)",
      }}
      className="relative"
    >
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Agente</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo agente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome do agente"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="setor">Setor *</Label>
              <Input
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleInputChange}
                placeholder="Digite o setor"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Digite a descrição do agente"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="configuracao">Configuração (JSON) *</Label>
              <Input
                id="configuracao"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddAgente}
              disabled={adicionarAgenteMutation.isPending}
            >
              {adicionarAgenteMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
            <DialogDescription>Atualize os dados do agente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome do agente"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-setor">Setor</Label>
              <Input
                id="edit-setor"
                name="setor"
                value={formData.setor}
                onChange={handleInputChange}
                placeholder="Digite o setor"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Textarea
                id="edit-descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Digite a descrição do agente"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-configuracao">
                Configuração (JSON - opcional)
              </Label>
              <Input
                id="edit-configuracao"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Deixe em branco para manter a configuração atual
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEditAgente}
              disabled={atualizarAgenteMutation.isPending}
            >
              {atualizarAgenteMutation.isPending
                ? "Atualizando..."
                : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o agente "{selectedAgente?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAgente}
              disabled={excluirAgenteMutation.isPending}
            >
              {excluirAgenteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <Grid className="grid-cols-4 gap-4">
          <Skeleton className="h-62.5 w-full" />
          <Skeleton className="h-62.5 w-full" />
          <Skeleton className="h-62.5 w-full" />
        </Grid>
      ) : isError ? (
        <Mensagem className="text-destructive">
          Erro ao carregar agentes
        </Mensagem>
      ) : data && data.length > 0 ? (
        <>
          <HeaderPagina>
            <div>
              <TituloPagina>Agentes Virtuais</TituloPagina>
              <DescricaoPagina>
                Gerencie os agentes virtuais disponíveis
              </DescricaoPagina>
            </div>
            {hasPermission("agentes:adicionar") && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Agente
              </Button>
            )}
          </HeaderPagina>
          <Grid className="grid-cols-4 gap-4">
            {data.map((agente: Agente) => (
              <motion.div
                key={agente.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", bounce: 0 }}
              >
                <Card className="h-100 flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3 shrink-0">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg leading-6">
                        {agente.nome}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {agente.setor}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 min-h-0">
                    <div className="mb-4 shrink-0">
                      <CardDescription className="text-sm line-clamp-3">
                        {agente.descricao}
                      </CardDescription>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Criado: {formatarData(agente.criado_em)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3" />
                        <span>
                          Atualizado: {formatarData(agente.atualizado_em)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto shrink-0 space-y-2">
                      <Button
                        onClick={() => handleDownloadConfig(agente)}
                        className="w-full hover:cursor-pointer"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar configuração
                      </Button>
                      <div className="flex space-x-2">
                        {hasPermission("agentes:atualizar") && (
                          <Button
                            variant="outline"
                            className="flex-1"
                            size="sm"
                            onClick={() => openEditModal(agente)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        )}
                        {hasPermission("agentes:excluir") && (
                          <Button
                            variant="destructive"
                            className="flex-1"
                            size="sm"
                            onClick={() => openDeleteModal(agente)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Mensagem className="text-muted-foreground mb-4">
            Nenhum agente encontrado.
          </Mensagem>
          {hasPermission("agentes:adicionar") && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar seu primeiro agente
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

Agentes.displayName = "Agentes";
