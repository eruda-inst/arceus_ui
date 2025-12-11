import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/ui/LineChartComponent/LineChartComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

interface RequisicaoPorHora {
  hora: string;
  total: number;
}

export function RequisicoesPorHora() {
  const [requisicoesPorHora, setRequisicoesPorHora] = useState([]);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.requisicoes_por_hora !== undefined) {
        setRequisicoesPorHora(data.requisicoes_por_hora);
      }
    },
    onOpen: () => {
      sendMetricaRequest("requisicoes_por_hora");
    },
    autoConnect: true,
  });

  function filtrarEProcessarRequisicoesPorHora(
    dados: RequisicaoPorHora[] | undefined,
  ) {
    if (!dados) return [];

    const agora = new Date();
    const horaAtual = agora.getHours();
    const dadosDiaCompleto: RequisicaoPorHora[] = Array.from(
      { length: horaAtual + 1 },
      (_, i) => ({
        hora: `${String(i)}h`,
        total: 0,
      }),
    );

    dados.forEach((item) => {
      const horaItem = parseInt(String(item.hora).split(":")[0], 10);
      if (horaItem <= horaAtual) {
        const indice = dadosDiaCompleto.findIndex(
          (d) => d.hora === `${String(horaItem)}h`,
        );
        if (indice !== -1) {
          dadosDiaCompleto[indice] = {
            ...item,
            hora: dadosDiaCompleto[indice].hora,
          };
        }
      }
    });

    return dadosDiaCompleto;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requisições por Hora (hoje)</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <LineChartComponent
            data={filtrarEProcessarRequisicoesPorHora(requisicoesPorHora)}
            xKey="hora"
            yKey="total"
            showDots={true}
          />
        ) : (
          <Skeleton className="h-[300px]" />
        )}
      </CardContent>
    </Card>
  );
}

RequisicoesPorHora.displayName = "RequisicoesPorHora";
