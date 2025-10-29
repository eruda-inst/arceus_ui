import { Card } from "@/app/components/Card";
import { Mensagem } from "@/app/components/Mensagem";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/utils/config";
import { useEffect } from "react";

interface DistribuicaoAcessosDiaSemanaData {
  [key: string]: number;
}

interface DistribuicaoAcessosDiaSemanaOut {
  distribuicao_acessos_dia_semana: DistribuicaoAcessosDiaSemanaData;
}

interface DistribuicaoAcessosDiaSemanaTransformed {
  diaSemana: string;
  acessos: number;
}

export function DistribuicaoAcessosDiaSemana() {
  const { data, isLoading, isError } =
    useReactWebSocket<DistribuicaoAcessosDiaSemanaOut>(
      API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_ACESSOS_DIA_SEMANA
    );

  function transformDistribuicaoAcessosDiaSemana(
    data: DistribuicaoAcessosDiaSemanaOut | null | undefined
  ): DistribuicaoAcessosDiaSemanaTransformed[] {
    if (!data || !data.distribuicao_acessos_dia_semana) {
      return [];
    }

    const acessosPordiaSemana = data.distribuicao_acessos_dia_semana;
    const transformedData: DistribuicaoAcessosDiaSemanaTransformed[] = [];

    Object.keys(acessosPordiaSemana).forEach((diaSemana) => {
      const acessos = acessosPordiaSemana[diaSemana];

      if (acessos > 0) {
        transformedData.push({
          diaSemana: diaSemana,
          acessos: acessos,
        });
      }
    });

    return transformedData;
  }

  const distribuicaoTransformada = transformDistribuicaoAcessosDiaSemana(data);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Distribuição de Acessos por Dia da Semana
      </h3>
      {isLoading ? (
        <Mensagem>Carregando...</Mensagem>
      ) : isError ? (
        <Mensagem className="text-red-500">Erro</Mensagem>
      ) : distribuicaoTransformada.length === 0 ? (
        "N/A"
      ) : (
        <BarChartComponent
          data={distribuicaoTransformada}
          xKey="diaSemana"
          yKey="acessos"
          barName="Número de Acessos"
          fill="#1ABC9C"
          activeBarColor="#E34363"
        />
      )}
    </Card>
  );
}

DistribuicaoAcessosDiaSemana.displayName = "DistribuicaoAcessosDiaSemana";
