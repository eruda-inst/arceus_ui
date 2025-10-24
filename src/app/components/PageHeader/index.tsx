import { SectionTitle } from "@/app/components/SectionTitle";

export function PageHeader() {
  return (
    <header className="fixed top-0 w-full ml-sidebar-width bg-bg-light border-b border-border-light p-4 flex items-center justify-between dark:bg-bg-dark dark:border-border-dark h-page-header-height z-10">
      <SectionTitle>Dashboard de Monitoramento</SectionTitle>
    </header>
  );
}

PageHeader.displayName = "PageHeader";
