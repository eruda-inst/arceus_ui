import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { formatarPorcentagem } from "@/helpers/formatar";

export function TaxaSucesso() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);
  const [totalSucessos, setTotalSucessos] = useState<number>(0);
  const [totalSucessosHoje, setTotalSucessosHoje] = useState<number>(0);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.taxa_sucesso !== undefined) {
        setValorGeral(data.taxa_sucesso);
      } else if (data.taxa_sucesso_hoje !== undefined) {
        setValorHoje(data.taxa_sucesso_hoje);
      } else if (data.total_sucessos !== undefined) {
        setTotalSucessos(data.total_sucessos);
      } else if (data.total_sucessos_hoje !== undefined) {
        setTotalSucessosHoje(data.total_sucessos_hoje);
      }
    },
    onOpen: () => {
      sendMetricaRequest("taxa_sucesso", "geral");
      sendMetricaRequest("taxa_sucesso", "hoje");
      sendMetricaRequest("total_sucessos", "geral");
      sendMetricaRequest("total_sucessos", "hoje");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Sucesso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
              <span className="text-sm text-muted-foreground">Geral</span>
              <div className="text-xl font-bold text-muted-foreground flex items-center">
                <div className="flex gap-x-1 items-end leading-tight">
                  <span>{formatarPorcentagem(valorGeral)}</span>
                  <span className="text-xs font-normal opacity-70">
                    ({totalSucessos})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="h-13 w-full" />
          )}
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
              <span className="text-sm">Hoje</span>
              <div className="text-xl font-bold flex items-center">
                <div className="flex gap-x-1 items-end leading-tight">
                  <span>{formatarPorcentagem(valorHoje)}</span>
                  <span className="text-xs font-normal opacity-70">
                    ({totalSucessosHoje})
                  </span>
                </div>
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

TaxaSucesso.displayName = "TaxaSucesso";
