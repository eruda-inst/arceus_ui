import { HtmlHTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface GridProps extends HtmlHTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export function Grid({ children, className, ...props }: GridProps) {
  const defaultStyle = "grid grid-cols-2 gap-4";

  return (
    <ul
      {...props}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </ul>
  );
}

Grid.displayName = "Grid";
