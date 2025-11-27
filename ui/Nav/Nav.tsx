"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartLine, LogOut, Table, Smile, Users, Bot } from "lucide-react";
import { Versao } from "@/ui/Versao/Versao";
import { usePathname, useRouter } from "next/navigation";
import { CartaoUsuario } from "@/ui/CartaoUsuario/CartaoUsuario";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { getHttpUrl, HTTP_ENDPOINTS_NAME } from "@/config/config";
import { toast } from "sonner";
import axios from "axios";

interface Formulario {
  senha: string;
  confirmarSenha: string;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: ChartLine },
  { path: "/registros", label: "Registros", icon: Table },
  { path: "/usuarios", label: "Usuários", icon: Users },
  { path: "/agentes", label: "Agentes", icon: Bot },
];

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, isAdmin } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm<Formulario>();

  const watchSenha = watch("senha");

  const onSubmit: SubmitHandler<Formulario> = async (data) => {
    if (!user) {
      toast.error("Erro", {
        position: "top-center",
        description: "Usuário não encontrado",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await api.patch(`${getHttpUrl(HTTP_ENDPOINTS_NAME.USUARIOS)}${user.id}`, {
        senha: data.senha,
      });

      toast.success("Sucesso!", {
        position: "top-center",
        description: "Senha atualizada com sucesso!",
      });

      reset();
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating password:", error);
      let errorMessage = "Erro ao atualizar senha";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          errorMessage;
      }

      toast.error("Erro", {
        position: "top-center",
        description: errorMessage,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleProfileClick = () => {
    setIsProfileDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsProfileDialogOpen(false);
    reset();
  };

  return (
    <>
      <SidebarProvider className="w-sidebar-width fixed">
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              Arceus
            </h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className="gap-y-2 mt-7">
                {navItems
                  .filter((item) => {
                    // show the users tab only for administrators
                    if (item.path === "/usuarios") {
                      return isAdmin() === true;
                    }
                    return true;
                  })
                  .map((item) => {
                    const isActive = pathname === item.path;
                    const IconComponent = item.icon;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          className={`border py-6 px-3 rounded-lg transition-colors ${
                            isActive ? "bg-bg-selected" : "bg-sidebar-accent"
                          } hover:cursor-pointer hover:bg-bg-selected`}
                          onClick={() => handleNavigation(item.path)}
                          aria-current={isActive ? "page" : undefined}
                          role="link"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleNavigation(item.path);
                            }
                          }}
                        >
                          <IconComponent aria-hidden="true" />
                          {item.label}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Versao />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hover:cursor-pointer">
                  {loading ? (
                    <Spinner />
                  ) : (
                    user && (
                      <CartaoUsuario
                        nome={user.nome || "Erro"}
                        funcao={
                          user?.id_grupo === 1 ? "Administrador" : "Usuário"
                        }
                      />
                    )
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleProfileClick}>
                  <Smile className="mr-2" />
                  Perfil e Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
      <Dialog open={isProfileDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil e Conta</DialogTitle>
            <DialogDescription>Configurações da conta</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                readOnly
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="nome">Nome</FieldLabel>
              <Input
                id="nome"
                type="text"
                value={user?.nome || ""}
                disabled
                readOnly
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="senha">Nova Senha</FieldLabel>
              <Input
                id="senha"
                type="password"
                autoComplete="new-password"
                placeholder="Digite a nova senha"
                {...register("senha", {
                  required: "Senha é obrigatório.",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter no mínimo 6 caracteres",
                  },
                })}
              />
              {errors.senha && (
                <span className="text-destructive text-sm">
                  {errors.senha.message}
                </span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmarSenha">
                Confirmar Nova Senha
              </FieldLabel>
              <Input
                id="confirmarSenha"
                type="password"
                autoComplete="new-password"
                placeholder="Confirme a nova senha"
                {...register("confirmarSenha", {
                  required: "Confirmação de senha é obrigatório.",
                  validate: (value) =>
                    value === watchSenha || "As senhas não coincidem",
                })}
              />
              {errors.confirmarSenha && (
                <span className="text-destructive text-sm">
                  {errors.confirmarSenha.message}
                </span>
              )}
            </Field>
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                type="submit"
                className="hover:cursor-pointer ml-auto w-fit"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? <Spinner /> : "Atualizar Senha"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
