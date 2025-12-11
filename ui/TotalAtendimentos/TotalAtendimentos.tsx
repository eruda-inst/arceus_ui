import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function TotalAtendimentos() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.total_atendimentos !== undefined) {
        setValorGeral(data.total_atendimentos);
      } else if (data.total_atendimentos_hoje !== undefined) {
        setValorHoje(data.total_atendimentos_hoje);
      }
    },
    onOpen: () => {
      sendMetricaRequest("total_atendimentos", "geral");
      sendMetricaRequest("total_atendimentos", "hoje");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Atendimentos</CardTitle>
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

TotalAtendimentos.displayName = "TotalAtendimentos";
