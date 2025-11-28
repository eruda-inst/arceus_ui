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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/ui/Grid/Grid";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdicionarUsuarioForm } from "@/ui/AdicionarUsuarioForm/AdicionarUsuarioForm";
import { ListagemUsuariosIXC } from "@/ui/ListagemUsuariosIXC/ListagemUsuariosIXC";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Lock, UserX, Trash2 } from "lucide-react";

interface Usuario {
  id: number;
  email: string;
  nome: string;
  id_grupo: number;
  ativo: boolean;
}

interface Usuarios {
  usuarios: Usuario[];
}

export default function Usuarios() {
  const { hasPermission, redirectIfNoPermission, loading } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedIXCUser, setSelectedIXCUser] = useState<{
    id: number;
    email: string;
    nome: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("usuarios:ver");
    }
  }, [loading, redirectIfNoPermission]);

  const { data, isLoading, isError, error } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}?itens_por_pagina=100`
      );
      return response.data;
    },
    retry: false,
  });

  const handleUserClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setIsActionsDialogOpen(true);
  };

  const handleChangePassword = () => {
    setIsActionsDialogOpen(false);
    setIsChangePasswordDialogOpen(true);
  };

  const handleDisableUser = () => {
    setIsActionsDialogOpen(false);
    setIsDisableDialogOpen(true);
  };

  const handleDeleteUser = () => {
    setIsActionsDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateUserStatus = async (ativo: boolean) => {
    if (!selectedUser) return;

    try {
      await api.patch(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}${selectedUser.id}`,
        { ativo: ativo }
      );
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setIsDisableDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}${selectedUser.id}`
      );
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleChangePasswordSubmit = async (novaSenha: string) => {
    if (!selectedUser) return;

    try {
      await api.patch(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}${selectedUser.id}`,
        { senha: novaSenha }
      );
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setIsChangePasswordDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!hasPermission("usuarios:ver")) {
    return null;
  }

  return (
    <div
      style={{
        height: "calc(100svh - var(--page-header-height) - 24px - 24px)",
      }}
      className="relative"
    >
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Mensagem className="text-destructive">
          Erro ao carregar usuários
        </Mensagem>
      ) : data && data.length > 0 ? (
        <Grid className="grid-cols-4">
          {data.map((usuario: Usuario) => (
            <motion.div
              key={usuario.id}
              whileHover={{ y: "-5%" }}
              transition={{ type: "spring", bounce: 0 }}
            >
              <Card
                className="hover:cursor-pointer relative"
                onClick={() => handleUserClick(usuario)}
              >
                <CardHeader>
                  <CardTitle>{usuario.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="flex flex-col gap-2">
                    <Badge variant="secondary">
                      {usuario?.id_grupo === 1 ? "Administrador" : "Usuário"}
                    </Badge>
                    <Badge variant={usuario.ativo ? "default" : "destructive"}>
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum usuário encontrado.
        </Mensagem>
      )}

      {/* Diálogo de Ações do Usuário */}
      <Dialog open={isActionsDialogOpen} onOpenChange={setIsActionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ações do Usuário</DialogTitle>
            <DialogDescription>
              Selecione uma ação para o usuário {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {hasPermission("usuarios:atualizar") && (
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={handleChangePassword}
              >
                <Lock className="h-4 w-4" />
                Mudar Senha
              </Button>
            )}
            {hasPermission("usuarios:atualizar") && (
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={handleDisableUser}
              >
                <UserX className="h-4 w-4" />
                {selectedUser?.ativo ? "Desativar Usuário" : "Ativar Usuário"}
              </Button>
            )}
            {hasPermission("usuarios:excluir") && (
              <Button
                variant="outline"
                className="justify-start gap-2 text-destructive"
                onClick={handleDeleteUser}
              >
                <Trash2 className="h-4 w-4" />
                Excluir Usuário
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Mudança de Senha */}
      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mudar Senha</DialogTitle>
            <DialogDescription>
              Digite a nova senha para {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSubmit={handleChangePasswordSubmit}
            onCancel={() => setIsChangePasswordDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de Desativar/Ativar Usuário */}
      <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.ativo ? "Desativar Usuário" : "Ativar Usuário"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.ativo
                ? `Tem certeza que deseja desativar o usuário ${selectedUser?.nome}?`
                : `Tem certeza que deseja ativar o usuário ${selectedUser?.nome}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDisableDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={selectedUser?.ativo ? "destructive" : "default"}
              onClick={() => handleUpdateUserStatus(!selectedUser?.ativo)}
            >
              {selectedUser?.ativo ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Excluir Usuário */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.nome}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUserConfirm}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogos existentes para adicionar usuário */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="fixed bottom-5 right-5">
            Novo usuário
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleção de Usuário do IXC</DialogTitle>
            <DialogDescription>
              Selecione o usuário do IXC que deseja adicionar ao sistema.
            </DialogDescription>
          </DialogHeader>
          <ListagemUsuariosIXC
            selectedId={selectedIXCUser?.id ?? null}
            onSelect={(u) => setSelectedIXCUser(u)}
            existingEmails={data?.map((u) => u.email) ?? []}
          />
          <Button
            disabled={!selectedIXCUser}
            onClick={() => {
              setIsProfileDialogOpen(false);
              setIsAddDialogOpen(true);
            }}
            className="w-fit ml-auto hover:cursor-pointer hover:disabled:cursor-not-allowed"
          >
            Selecionar Usuário
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>Preencha grupo e senha.</DialogDescription>
          </DialogHeader>
          <AdicionarUsuarioForm
            initialValues={
              selectedIXCUser
                ? {
                    id: selectedIXCUser.id,
                    email: selectedIXCUser.email,
                    nome: selectedIXCUser.nome,
                  }
                : undefined
            }
            onCreated={() => {
              setIsAddDialogOpen(false);
              setSelectedIXCUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ChangePasswordForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (novaSenha: string) => void;
  onCancel: () => void;
}) => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha === confirmarSenha) {
      onSubmit(novaSenha);
    } else {
      alert("As senhas não coincidem!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="novaSenha" className="text-sm font-medium">
          Nova Senha
        </label>
        <input
          id="novaSenha"
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmarSenha" className="text-sm font-medium">
          Confirmar Senha
        </label>
        <input
          id="confirmarSenha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Alterar Senha</Button>
      </div>
    </form>
  );
};

Usuarios.displayName = "Usuarios";
