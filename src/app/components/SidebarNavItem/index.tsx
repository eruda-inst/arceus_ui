import { HTMLAttributes, ReactNode } from "react";

interface SidebarNavItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  selected?: boolean;
}

export function SidebarNavItem({
  children,
  selected = false,
  ...props
}: SidebarNavItemProps) {
  const baseStyle =
    "flex items-center gap-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 border";
  const selectedStyle = selected
    ? "bg-blue-50 dark:bg-blue-900/20 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold border-blue-100 dark:border-blue-800"
    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700";

  return (
    <li {...props} className={`${baseStyle} ${selectedStyle}`}>
      {children}
    </li>
  );
}

SidebarNavItem.displayName = "SidebarNavItem";
