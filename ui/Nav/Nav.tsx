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
import { LuChartLine, LuLogOut, LuTable } from "react-icons/lu";
import { VersionInfo } from "@/ui/VersionInfo/VersionInfo";
import { usePathname, useRouter } from "next/navigation";
import { CardUsuario } from "@/ui/CardUsuario/CardUsuario";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Remove o token do cookie
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redireciona para a página de login
    router.push("/login");
    router.refresh(); // Força atualização para limpar estado da aplicação
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`border py-6 px-3 rounded-lg ${
                    pathname === "/" ? "bg-bg-selected" : "bg-sidebar-accent"
                  } hover:cursor-pointer hover:bg-bg-selected`}
                  onClick={() => router.push("/")}
                >
                  <LuChartLine /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`border py-6 px-3 rounded-lg ${
                    pathname === "/registros"
                      ? "bg-bg-selected"
                      : "bg-sidebar-accent"
                  } hover:cursor-pointer hover:bg-bg-selected`}
                  onClick={() => router.push("/registros")}
                >
                  <LuTable /> Registros
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <VersionInfo />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <CardUsuario nome="John Doe" funcao="admin" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Perfil e Conta</DropdownMenuItem>
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
