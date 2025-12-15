import { ReactNode } from "react";

interface HeaderPaginaProps {
  children: ReactNode;
}

export default function HeaderPagina({ children }: HeaderPaginaProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
      {children}
    </div>
  );
}

export { HeaderPagina };
