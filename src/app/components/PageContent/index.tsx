import { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <main
      style={{ minWidth: "calc(1024px - var(--sidebar-width))" }}
      className="ml-[var(--sidebar-width)] p-6 flex flex-col gap-y-8 mt-[var(--page-header-height)]"
    >
      {children}
    </main>
  );
}

PageContent.displayName = "PageContent";
