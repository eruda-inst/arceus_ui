import { useEffect, useRef } from "react";

type useTituloPaginaOptions = {
  titulo: string;
  restoraQuandoMontado?: boolean;
  sufixo?: string;
  prefixo?: string;
};

function useTituloPagina({
  titulo,
  restoraQuandoMontado = true,
  sufixo = undefined,
  prefixo = undefined,
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

function useTituloPaginaSimples(titulo: string): void {
  useTituloPagina({ titulo });
}

export { useTituloPagina, useTituloPaginaSimples };
