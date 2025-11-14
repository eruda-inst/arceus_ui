import { useMemo } from "react";
import { v4 as uuid } from "uuid";

/**
 * Versão simplificada para quando você só precisa do número de keys
 * @param length Número de keys necessárias
 * @returns Array de keys estáveis com o comprimento especificado
 */
function useChavesEstaveis(length: number): string[] {
  return useMemo(() => {
    return Array.from({ length }, () => uuid());
  }, [length]);
}

export { useChavesEstaveis };
