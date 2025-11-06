import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";

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
      <CardHeader>
        <CardTitle>
          Distribuição de Acessos por Dia da Semana (todo o período)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Mensagem>Carregando...</Mensagem>
        ) : isError ? (
          <Mensagem className="text-destructive">Erro</Mensagem>
        ) : distribuicaoTransformada.length === 0 ? (
          <Mensagem className="text-destructive">N/A</Mensagem>
        ) : (
          <BarChartComponent
            data={distribuicaoTransformada}
            xKey="diaSemana"
            yKey="acessos"
            barName="Número de Acessos"
            fill="var(--chart-4)"
            activeBarColor="var(--chart-4)"
          />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoAcessosDiaSemana.displayName = "DistribuicaoAcessosDiaSemana";
