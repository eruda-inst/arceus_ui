import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface TdProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Td({ children, className = "" }: TdProps) {
  const baseStyle = "px-6 py-4 whitespace-nowrap";

  return (
    <td className={twMerge(baseStyle, className as ClassNameValue)}>
      {children}
    </td>
  );
}

Td.displayName = "Td";
