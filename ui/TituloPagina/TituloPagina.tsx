import { ReactNode } from "react";

interface TituloPaginaProps {
  children: ReactNode;
}

export default function TituloPagina({ children }: TituloPaginaProps) {
  return <h1 className="text-2xl font-bold">{children}</h1>;
}

TituloPagina.displayName = "TituloPagina";
