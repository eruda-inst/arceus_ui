import { HtmlHTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface MensagemProps extends HtmlHTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function Mensagem({ children, className, ...props }: MensagemProps) {
  const defaultStyle =
    "text-blue-500 w-full text-start font-bold mt-5 text-base";

  return (
    <p
      {...props}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </p>
  );
}

Mensagem.displayName = "Mensagem";
