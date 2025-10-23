"use client";

import { FaChartLine, FaTableList } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNavItem } from "@/app/components/SidebarNavItem";

export function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-y-2 mt-10">
      <SidebarNavItem
        selected={pathname === "/"}
        onClick={() => router.push("/")}
      >
        <FaChartLine /> Dashboard
      </SidebarNavItem>
      <SidebarNavItem
        selected={pathname === "/logs-completo"}
        onClick={() => router.push("/logs-completo")}
      >
        <FaTableList /> Logs Completo
      </SidebarNavItem>
    </ul>
  );
}

SidebarNav.displayName = "SidebarNav";
