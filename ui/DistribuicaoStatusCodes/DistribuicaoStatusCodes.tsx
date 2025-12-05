import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function DistribuicaoStatusCodes() {
  const [distribuicao, setDistribuicao] = useState([]);

  const { isConnected, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      // Verificar qual resposta chegou
      if (data.distribuicao_status_codes !== undefined) {
        setDistribuicao(data.distribuicao_status_codes);
      }
    },
    onOpen: () => {
      // Solicitar métricas quando a conexão for estabelecida
      sendMetricaRequest("distribuicao_status_codes");
    },
    autoConnect: true,
  });

  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("distribuicao_status_codes");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Status Codes (todo o período)</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <BarChartComponent
            data={distribuicao}
            xKey="status_code"
            yKey="total"
            barSize={60}
            fill="var(--chart-2)"
            activeBarColor="var(--chart-2)"
            labelText="Total"
          />
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoStatusCodes.displayName = "DistribuicaoStatusCodes";
