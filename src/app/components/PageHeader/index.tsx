import { SectionTitle } from "@/app/components/SectionTitle";

export function PageHeader() {
  return (
    <header className="fixed top-0 w-full ml-64 bg-[var(--bg-light)] border-b border-[var(--border-light)] p-4 flex items-center justify-between dark:bg-[var(--bg-dark)] dark:border-[var(--border-dark)] h-[var(--page-header-height)] z-10">
      <SectionTitle>Dashboard de Monitoramento</SectionTitle>
    </header>
  );
}

PageHeader.displayName = "PageHeader";
