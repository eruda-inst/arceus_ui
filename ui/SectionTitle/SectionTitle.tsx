import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function SectionTitle({
  children,
  className,
  ...props
}: SectionTitleProps) {
  const defaultStyle = "text-lg font-semibold";

  return (
    <h2
      {...props}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </h2>
  );
}

SectionTitle.displayName = "SectionTitle";
