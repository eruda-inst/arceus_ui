import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function TotalRequisicoes() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);

  const { sendMetricaRequest, isLoading } = useMetricaWebSocket({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Requisições</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
              <span className="text-sm text-muted-foreground">Geral</span>
              <div className="text-xl font-bold text-muted-foreground flex items-center">
                {valorGeral}
              </div>
            </div>
          ) : (
            <Skeleton className="h-13 w-full" />
          )}
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
              <span className="text-sm">Hoje</span>
              <div className="text-xl font-bold flex items-center">
                {valorHoje}
              </div>
            </div>
          ) : (
            <Skeleton className="h-13 w-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

TotalRequisicoes.displayName = "TotalRequisicoes";
