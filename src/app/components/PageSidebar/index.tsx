import { ReactNode } from "react";
import { VersionInfo } from "@/app/components/VersionInfo";

interface PageSidebarProps {
  children: ReactNode;
}

export function PageSidebar({ children }: PageSidebarProps) {
  return (
    <nav className="sidebar w-sidebar-width bg-bg-light dark:bg-bg-dark border-r border-border-light dark:border-border-dark p-4 flex flex-col fixed h-full z-10 top-0">
      {children}
      <div className="mt-auto">
        <VersionInfo className="mb-0 text-gray-500" />
      </div>
    </nav>
  );
}

PageSidebar.displayName = "PageSidebar";
