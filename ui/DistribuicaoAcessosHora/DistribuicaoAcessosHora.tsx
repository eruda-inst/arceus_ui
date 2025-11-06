import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";

interface DistribuicaoAcessosHoraData {
  [key: string]: number;
}

interface DistribuicaoAcessosHoraOut {
  distribuicao_acessos_hora: DistribuicaoAcessosHoraData;
}

interface DistribuicaoAcessosHoraTransformed {
  hora: string;
  acessos: number;
}

export function DistribuicaoAcessosHora() {
  const { data, isLoading, isError } =
    useReactWebSocket<DistribuicaoAcessosHoraOut>(
      API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_ACESSOS_HORA
    );

  function transformDistribuicaoAcessosHora(
    data: DistribuicaoAcessosHoraOut | null | undefined
  ): DistribuicaoAcessosHoraTransformed[] {
    if (!data || !data.distribuicao_acessos_hora) {
      return [];
    }

    const acessosPorHora = data.distribuicao_acessos_hora;
    const transformedData: DistribuicaoAcessosHoraTransformed[] = [];

    Object.keys(acessosPorHora).forEach((hora) => {
      const acessos = acessosPorHora[hora];

      if (acessos > 0) {
        const horaFormatada = `${hora}:00`;

        transformedData.push({
          hora: horaFormatada,
          acessos: acessos,
        });
      }
    });

    transformedData.sort((a, b) => {
      const horaA = parseInt(a.hora.split(":")[0]);
      const horaB = parseInt(b.hora.split(":")[0]);
      return horaA - horaB;
    });

    return transformedData;
  }

  const distribuicaoTransformada = transformDistribuicaoAcessosHora(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Acessos por Hora (todo o período)</CardTitle>
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
            xKey="hora"
            yKey="acessos"
            barName="Número de Acessos"
            fill="var(--chart-3)"
            activeBarColor="var(--chart-3)"
          />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoAcessosHora.displayName = "DistribuicaoAcessosHora";
