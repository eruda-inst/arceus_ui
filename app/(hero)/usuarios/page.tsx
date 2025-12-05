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
import { Lock, Trash2, Ban, CheckCircle, UserCog } from "lucide-react";

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

  const { data, isLoading, isError } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await api.get(
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}?itens_por_pagina=100`,
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
        { ativo: ativo },
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
        `${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}${selectedUser.id}`,
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
        { senha: novaSenha },
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
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((usuario: Usuario) => (
            <motion.div
              key={usuario.id}
              whileHover={usuario.ativo ? { y: "-5%" } : {}}
              transition={{ type: "spring", bounce: 0 }}
            >
              <Card
                className={`
                  hover:cursor-pointer relative overflow-hidden
                  transition-all duration-200
                  ${
                    !usuario.ativo
                      ? "bg-muted/50 opacity-80 hover:opacity-100"
                      : "hover:shadow-md"
                  }
                `}
                onClick={() => handleUserClick(usuario)}
              >
                <div
                  className={`absolute top-0 right-0 p-2 ${usuario.ativo ? "text-green-500" : "text-muted-foreground"}`}
                >
                  {usuario.ativo ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Ban className="h-5 w-5" />
                  )}
                </div>
                {usuario.id_grupo === 1 && (
                  <div className="absolute top-2 left-2">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                )}
                <CardHeader className="pt-6">
                  <CardTitle
                    className={`
                    flex items-center gap-2
                    ${!usuario.ativo ? "text-muted-foreground" : ""}
                  `}
                  >
                    <div className="flex-1 truncate" title={usuario.nome}>
                      {usuario.nome}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="flex flex-col gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`
                            ${!usuario.ativo ? "opacity-75" : ""}
                            flex items-center gap-1
                          `}
                        >
                          <UserCog className="h-3 w-3" />
                          {usuario?.id_grupo === 1
                            ? "Administrador"
                            : "Usuário"}
                        </Badge>
                      </div>
                      <Badge
                        variant={usuario.ativo ? "default" : "outline"}
                        className={`
                          ${
                            usuario.ativo
                              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
                              : "border-destructive/30 text-destructive bg-destructive/10"
                          }
                          flex items-center gap-1 w-fit
                        `}
                      >
                        {usuario.ativo ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3" />
                            Inativo
                          </>
                        )}
                      </Badge>
                    </div>
                    <div
                      className={`
                      text-sm pt-2 border-t border-border/50
                      ${!usuario.ativo ? "text-muted-foreground" : "text-foreground"}
                      flex items-start gap-2
                    `}
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-muted-foreground mb-1">
                          Email
                        </div>
                        <div className="truncate" title={usuario.email}>
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </CardDescription>
                </CardContent>
                {!usuario.ativo && (
                  <div className="absolute inset-0 bg-linear-to-t from-background/10 to-transparent pointer-events-none" />
                )}
              </Card>
            </motion.div>
          ))}
        </Grid>
      ) : (
        <Mensagem className="text-destructive">
          Nenhum usuário encontrado.
        </Mensagem>
      )}
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
                className={`
                  justify-start gap-2
                  ${
                    selectedUser?.ativo
                      ? "text-destructive hover:text-destructive"
                      : "text-green-600 hover:text-green-600"
                  }
                `}
                onClick={handleDisableUser}
              >
                {selectedUser?.ativo ? (
                  <>
                    <Ban className="h-4 w-4" />
                    Desativar Usuário
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Ativar Usuário
                  </>
                )}
              </Button>
            )}
            {hasPermission("usuarios:excluir") && (
              <Button
                variant="outline"
                className="justify-start gap-2 text-destructive hover:text-destructive"
                onClick={handleDeleteUser}
              >
                <Trash2 className="h-4 w-4" />
                Excluir Usuário
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
      <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.ativo ? "Desativar Usuário" : "Ativar Usuário"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.ativo
                ? `Tem certeza que deseja desativar o usuário ${selectedUser?.nome}? O usuário não poderá mais acessar o sistema.`
                : `Tem certeza que deseja ativar o usuário ${selectedUser?.nome}? O usuário voltará a ter acesso ao sistema.`}
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
              className={
                selectedUser?.ativo ? "" : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedUser?.ativo ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
