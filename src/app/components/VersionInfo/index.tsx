import { HTMLAttributes } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface VersionInfoProps extends HTMLAttributes<HTMLParagraphElement> {}

export function VersionInfo({ className = "" }: VersionInfoProps) {
  const defaultStyle = "text-white/70 text-sm mb-2";

  return (
    <p className={twMerge(defaultStyle, className as ClassNameValue)}>
      Versão: 0.72.0
    </p>
  );
}

VersionInfo.displayName = "VersionInfo";
