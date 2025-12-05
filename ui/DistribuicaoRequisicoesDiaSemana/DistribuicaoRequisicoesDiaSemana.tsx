import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function DistribuicaoRequisicoesDiaSemana() {
  const [distribuicao, setDistribuicao] = useState([]);

  const { isConnected, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      // Verificar qual resposta chegou
      if (data.distribuicao_requisicoes_dia_semana !== undefined) {
        const weekdaysMap: Record<string, string> = {
          domingo: "Dom",
          segunda: "Seg",
          terça: "Ter",
          quarta: "Qua",
          quinta: "Qui",
          sexta: "Sex",
          sábado: "Sáb",
        };
        const transformada = data.distribuicao_requisicoes_dia_semana.map(
          (distribuiocao: Record<string, number>) => ({
            dia: weekdaysMap[distribuiocao.dia] || distribuiocao.dia,
            total: distribuiocao.total,
          }),
        );
        setDistribuicao(transformada);
      }
    },
    onOpen: () => {
      // Solicitar métricas quando a conexão for estabelecida
      sendMetricaRequest("distribuicao_requisicoes_dia_semana");
    },
    autoConnect: true,
  });

  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("distribuicao_requisicoes_dia_semana");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Distribuição de Requisições por Dia da Semana (todo o período)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <BarChartComponent
            data={distribuicao}
            xKey="dia"
            yKey="total"
            barSize={60}
            fill="var(--chart-4)"
            activeBarColor="var(--chart-4)"
            labelText="Total"
          />
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoRequisicoesDiaSemana.displayName =
  "DistribuicaoRequisicoesDiaSemana";
