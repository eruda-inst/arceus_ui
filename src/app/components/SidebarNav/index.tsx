import { ReactNode } from "react";

interface SidebarNavProps {
  children: ReactNode;
}

export function SidebarNav({ children }: SidebarNavProps) {
  return <ul className="flex flex-1 flex-col gap-y-2 mt-8">{children}</ul>;
}

SidebarNav.displayName = "SidebarNav";
