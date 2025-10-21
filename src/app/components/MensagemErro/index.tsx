import { HtmlHTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface MensagemErroProps extends HtmlHTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function MensagemErro({
  children,
  className,
  ...props
}: MensagemErroProps) {
  const defaultStyle =
    "text-red-500 w-full text-start font-bold mt-5 text-base";

  return (
    <p
      {...props}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </p>
  );
}

MensagemErro.displayName = "MensagemErro";
