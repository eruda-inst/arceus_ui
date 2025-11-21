import { HTMLAttributes } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

export function Versao({
  className = "",
}: HTMLAttributes<HTMLParagraphElement>) {
  const defaultStyle = "text-white/70 text-sm mb-2";

  return (
    <p className={twMerge(defaultStyle, className as ClassNameValue)}>
      Versão: 0.87.9
    </p>
  );
}

Versao.displayName = "Versao";
