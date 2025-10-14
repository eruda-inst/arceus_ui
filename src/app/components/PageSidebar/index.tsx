import { ReactNode } from "react";

interface PageSidebarProps {
  children: ReactNode;
}

export function PageSidebar({ children }: PageSidebarProps) {
  return (
    <nav className="sidebar w-64 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] border-r border-[var(--border-light)] dark:border-[var(--border-dark)] p-4 flex flex-col fixed h-full z-10 top-0">
      {children}
      <div className="mt-auto">
        <span className="text-gray-500 text-sm">v0.50.0</span>
      </div>
    </nav>
  );
}

PageSidebar.displayName = "PageSidebar";
