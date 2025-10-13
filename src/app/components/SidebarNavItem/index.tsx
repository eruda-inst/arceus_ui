import { ReactNode } from "react";

interface SidebarNavItemProps {
  children: ReactNode;
}

export function SidebarNavItem({ children }: SidebarNavItemProps) {
  return (
    <li className="flex items-center gap-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
      {children}
    </li>
  );
}

SidebarNavItem.displayName = "SidebarNavItem";
