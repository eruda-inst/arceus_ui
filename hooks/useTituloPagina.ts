import { useEffect, useRef } from "react";

type useTituloPaginaOptions = {
  titulo: string;
  restoraQuandoMontado?: boolean;
  sufixo?: string;
  prefixo?: string;
};

export function useTituloPagina({
  titulo,
  restoraQuandoMontado = true,
  sufixo,
  prefixo,
}: useTituloPaginaOptions): void {
  const tituloOriginal = useRef<string>("");

  useEffect(() => {
    if (tituloOriginal.current === "") {
      tituloOriginal.current = document.title;
    }
    let tituloFinal = titulo;
    if (prefixo) {
      tituloFinal = `${prefixo}${tituloFinal}`;
    }
    if (sufixo) {
      tituloFinal = `${tituloFinal}${sufixo}`;
    }
    document.title = tituloFinal;
    return () => {
      if (restoraQuandoMontado && tituloOriginal.current) {
        document.title = tituloOriginal.current;
      }
    };
  }, [titulo, restoraQuandoMontado, sufixo, prefixo]);
}

export function useTituloPaginaSimple(titulo: string): void {
  useTituloPagina({ titulo });
}
