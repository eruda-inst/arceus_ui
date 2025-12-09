import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function TotalRequisicoes() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);

  const { isConnected, isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.total_requisicoes !== undefined) {
        setValorGeral(data.total_requisicoes);
      } else if (data.total_requisicoes_hoje !== undefined) {
        setValorHoje(data.total_requisicoes_hoje);
      }
    },
    onOpen: () => {
      sendMetricaRequest("total_requisicoes", "geral");
      sendMetricaRequest("total_requisicoes", "hoje");
    },
    autoConnect: true,
  });

  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("total_requisicoes", "geral");
      sendMetricaRequest("total_requisicoes", "hoje");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Requisições</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
            <span className="text-sm text-muted-foreground">Geral</span>
            <div className="text-xl font-bold text-muted-foreground flex items-center">
              {isConnected ? valorGeral : <Spinner />}
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
            <span className="text-sm">Hoje</span>
            <div className="text-xl font-bold flex items-center">
              {isConnected && !isLoading ? valorHoje : <Spinner />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

TotalRequisicoes.displayName = "TotalRequisicoes";
