import { SectionTitle } from "@/ui/SectionTitle/SectionTitle";

export function PageHeader() {
  return (
    <header className="bg-card fixed top-0 w-full ml-sidebar-width p-4 flex items-center justify-between h-page-header-height z-10 border-b">
      <SectionTitle>Dashboard de Monitoramento</SectionTitle>
    </header>
  );
}

PageHeader.displayName = "PageHeader";
