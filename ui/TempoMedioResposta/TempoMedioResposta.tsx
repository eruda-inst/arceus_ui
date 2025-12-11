import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { formatarTempo } from "@/helpers/formatar";

export function TempoMedioResposta() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);

  const { isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.tempo_medio_resposta !== undefined) {
        setValorGeral(data.tempo_medio_resposta);
      } else if (data.tempo_medio_resposta_hoje !== undefined) {
        setValorHoje(data.tempo_medio_resposta_hoje);
      }
    },
    onOpen: () => {
      sendMetricaRequest("tempo_medio_resposta", "geral");
      sendMetricaRequest("tempo_medio_resposta", "hoje");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo Médio de Resposta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
              <span className="text-sm text-muted-foreground">Geral</span>
              <div className="text-xl font-bold text-muted-foreground flex items-center">
                {formatarTempo(valorGeral)}
              </div>
            </div>
          ) : (
            <Skeleton className="h-13 w-full" />
          )}
          {!isLoading ? (
            <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
              <span className="text-sm">Hoje</span>
              <div className="text-xl font-bold flex items-center">
                {formatarTempo(valorHoje)}
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

TempoMedioResposta.displayName = "TempoMedioResposta";
