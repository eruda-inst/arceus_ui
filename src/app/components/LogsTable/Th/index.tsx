import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface ThProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Th({ children, className = "" }: ThProps) {
  const baseStyle =
    "px-6 py-3 text-left text-white text-xs font-medium uppercase tracking-wider";

  return (
    <th className={twMerge(baseStyle, className as ClassNameValue)}>
      {children}
    </th>
  );
}

Th.displayName = "Th";
