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
import { LuChartLine, LuLogOut, LuTable, LuSmile } from "react-icons/lu";
import { VersionInfo } from "@/ui/VersionInfo/VersionInfo";
import { usePathname, useRouter } from "next/navigation";
import { CardUsuario } from "@/ui/CardUsuario/CardUsuario";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG } from "@/config/config";

interface Usuario {
  id: number;
  email: string;
  nome: string;
  funcao: string;
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

  const { data: usuario, isLoading } = useQuery({
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
    retry: 1,
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

  return (
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
                    >
                      <IconComponent />
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
              <div className="cursor-pointer">
                <CardUsuario
                  nome={usuario?.nome || "Carregando..."}
                  funcao={usuario?.funcao || "Usuário"}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
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
  );
}

Nav.displayName = "Nav";
