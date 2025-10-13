import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface SidebarTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function SidebarTitle({ children, className, ...props }: SidebarTitleProps) {
  const defaultStyle = "text-xl font-bold text-blue-600 dark:text-blue-400";

  return (
    <h1
      {...props}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </h1>
  );
}

SidebarTitle.displayName = "SidebarTitle";
