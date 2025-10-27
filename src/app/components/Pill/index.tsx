import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Pill({ children, className = "" }: PillProps) {
  const baseStyle =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";

  return (
    <span className={twMerge(baseStyle, className as ClassNameValue)}>
      {children}
    </span>
  );
}

Pill.displayName = "Pill";
