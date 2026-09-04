import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { CURRENT_VERSION } from "@/configs/misc.config";

export const metadata: Metadata = { title: "Arceus · Início" };

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="fixed top-0 w-full ml-sidebar-width p-4 flex items-center justify-between h-header-height z-20 border-b border-b-divider bg-surface">
        <h1 className="text-lg font-semibold">
          Sistema de Monitoramento de Requisições v{CURRENT_VERSION}
        </h1>
      </header>

      <Sidebar />

      <main className="ml-sidebar-width p-4 mt-header-height">{children}</main>
    </>
  );
}
