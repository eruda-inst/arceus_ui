import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { LineChartComponent } from "@/ui/LineChartComponent/LineChartComponent";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { useEffect, useState } from "react";

interface RequisicaoPorHora {
  hora: string;
  total: number;
}

export function RequisicoesPorHora() {
  const [requisicoesPorHora, setRequisicoesPorHora] = useState([]);

  const { isConnected, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      // Verificar qual resposta chegou
      if (data.requisicoes_por_hora !== undefined) {
        setRequisicoesPorHora(data.requisicoes_por_hora);
      }
    },
    onOpen: () => {
      // Solicitar métricas quando a conexão for estabelecida
      sendMetricaRequest("requisicoes_por_hora");
    },
    autoConnect: true,
  });

  // Enviar requisição periodicamente
  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("requisicoes_por_hora");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

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
        {isConnected ? (
          <LineChartComponent
            data={filtrarEProcessarRequisicoesPorHora(requisicoesPorHora)}
            xKey="hora"
            yKey="total"
            showDots={true}
          />
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

RequisicoesPorHora.displayName = "RequisicoesPorHora";
