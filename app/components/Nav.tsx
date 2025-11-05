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
import { LuChartLine, LuTable } from "react-icons/lu";
import { VersionInfo } from "@/app/components/VersionInfo";
import { usePathname, useRouter } from "next/navigation";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

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
                    pathname === "/logs-completo"
                      ? "bg-bg-selected"
                      : "bg-sidebar-accent"
                  } hover:cursor-pointer hover:bg-bg-selected`}
                  onClick={() => router.push("/logs-completo")}
                >
                  <LuTable /> Registros
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <VersionInfo />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

Nav.displayName = "Nav";
