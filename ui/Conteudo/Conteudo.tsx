import { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

export function Conteudo({ children }: PageContentProps) {
  return (
    <main
      style={{ minWidth: "calc(1024px - var(--sidebar-width))" }}
      className="ml-sidebar-width p-6 mt-page-header-height"
    >
      {children}
    </main>
  );
}

Conteudo.displayName = "Conteudo";
