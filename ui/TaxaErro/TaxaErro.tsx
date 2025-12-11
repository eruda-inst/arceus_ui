import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { formatarPorcentagem } from "@/helpers/formatar";

export function TaxaErro() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);
  const [totalErros, setTotalErros] = useState<number>(0);
  const [totalErrosHoje, setTotalErrosHoje] = useState<number>(0);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.taxa_erro !== undefined) {
        setValorGeral(data.taxa_erro);
      } else if (data.taxa_erro_hoje !== undefined) {
        setValorHoje(data.taxa_erro_hoje);
      } else if (data.total_erros !== undefined) {
        setTotalErros(data.total_erros);
      } else if (data.total_erros_hoje !== undefined) {
        setTotalErrosHoje(data.total_erros_hoje);
      }
    },
    onOpen: () => {
      sendMetricaRequest("taxa_erro", "geral");
      sendMetricaRequest("taxa_erro", "hoje");
      sendMetricaRequest("total_erros", "geral");
      sendMetricaRequest("total_erros", "hoje");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Erro</CardTitle>
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
                    ({totalErros})
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
                    ({totalErrosHoje})
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

TaxaErro.displayName = "TaxaErro";
