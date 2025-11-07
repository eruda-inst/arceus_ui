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
import { LuChartLine, LuLogOut, LuTable, LuSmile } from "react-icons/lu";
import { VersionInfo } from "@/ui/VersionInfo/VersionInfo";
import { usePathname, useRouter } from "next/navigation";
import { CardUsuario } from "@/ui/CardUsuario/CardUsuario";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG } from "@/config/config";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface Usuario {
  id: number;
  email: string;
  nome: string;
  funcao: string;
}

interface Formulario {
  senha: string;
  confirmarSenha: string;
}

// Extract cookie logic to a reusable function
function getAuthToken(): string | undefined {
  if (typeof document === "undefined") return undefined;

  return document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("auth-token="))
    ?.split("=")[1];
}

// Navigation items configuration for better maintainability
const navItems = [
  { path: "/", label: "Dashboard", icon: LuChartLine },
  { path: "/registros", label: "Registros", icon: LuTable },
];

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm<Formulario>();

  const watchSenha = watch("senha");

  const onSubmit: SubmitHandler<Formulario> = async (data) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await axios.patch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.HTTP_ENDPOINTS.ME}`,
        { senha: data.senha },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and close dialog on success
      reset();
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const {
    data: usuario,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["usuario"],
    queryFn: async (): Promise<Usuario> => {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios(
        `${API_CONFIG.BASE_URL}${API_CONFIG.HTTP_ENDPOINTS.ME}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLogout = () => {
    // Clear the auth token
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login
    window.location.href = "/login";
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleProfileClick = () => {
    setIsProfileDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsProfileDialogOpen(false);
    reset(); // Reset form when dialog closes
  };

  return (
    <>
      <SidebarProvider className="w-sidebar-width fixed">
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              Aggregator &middot; Monitor
            </h1>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className="gap-y-2 mt-7">
                {navItems.map((item) => {
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
            <VersionInfo />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hover:cursor-pointer">
                  <CardUsuario
                    nome={
                      isLoading ? "Carregando..." : usuario?.nome || "Usuário"
                    }
                    funcao={
                      isLoading
                        ? "Carregando..."
                        : usuario?.funcao || "Função não definida"
                    }
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleProfileClick}>
                  <LuSmile className="mr-2" />
                  Perfil e Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LuLogOut className="mr-2" />
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
              <FieldLabel htmlFor="senha">Nova Senha</FieldLabel>
              <Input
                id="senha"
                type="password"
                placeholder="Digite a nova senha"
                autoFocus
                {...register("senha", {
                  required: "Campo obrigatório",
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
                placeholder="Confirme a nova senha"
                {...register("confirmarSenha", {
                  required: "Campo obrigatório",
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
                variant="outline"
                type="button"
                onClick={handleDialogClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                type="submit"
                className="flex-1 hover:cursor-pointer"
              >
                Salvar Senha
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

Nav.displayName = "Nav";
