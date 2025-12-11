import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function DistribuicaoRequisicoesHora() {
  const [distribuicao, setDistribuicao] = useState([]);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.distribuicao_requisicoes_hora !== undefined) {
        const transformada = data.distribuicao_requisicoes_hora
          .filter(
            (distribuicao: Record<string, number>) => distribuicao.total > 0,
          )
          .map((distribuicao: Record<string, number>) => ({
            hora: `${distribuicao.hora}h`,
            total: distribuicao.total,
          }));

        setDistribuicao(transformada);
      }
    },
    onOpen: () => {
      sendMetricaRequest("distribuicao_requisicoes_hora");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Distribuição de Requisições por Hora (todo o período)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <BarChartComponent
            data={distribuicao}
            xKey="hora"
            yKey="total"
            barSize={60}
            fill="var(--chart-3)"
            activeBarColor="var(--chart-3)"
            labelText="Total"
          />
        ) : (
          <Skeleton className="h-[300px]" />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoRequisicoesHora.displayName = "DistribuicaoRequisicoesHora";
