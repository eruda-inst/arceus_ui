import { ReactNode } from "react";

interface DescricaoPaginaProps {
  children: ReactNode;
}

export default function DescricaoPagina({ children }: DescricaoPaginaProps) {
  return <p className="text-muted-foreground">{children}</p>;
}

DescricaoPagina.displayName = "DescricaoPagina";
