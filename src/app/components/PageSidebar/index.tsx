import { ReactNode } from "react";

interface PageSidebarProps {
  children: ReactNode;
}

export function PageSidebar({ children }: PageSidebarProps) {
  return (
    <nav className="sidebar w-sidebar-width bg-bg-light dark:bg-bg-dark border-r border-border-light dark:border-border-dark p-4 flex flex-col fixed h-full z-10 top-0">
      {children}
      <div className="mt-auto">
        <span className="text-gray-500 text-sm">Versão: 0.69.9</span>
      </div>
    </nav>
  );
}

PageSidebar.displayName = "PageSidebar";
