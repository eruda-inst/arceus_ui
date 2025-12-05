"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";

export function TotalAtendimentos() {
  const [valorGeral, setValorGeral] = useState<number>(0);
  const [valorHoje, setValorHoje] = useState<number>(0);

  const { isConnected, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      // Verificar qual resposta chegou
      if (data.total_atendimentos !== undefined) {
        setValorGeral(data.total_atendimentos);
      } else if (data.total_atendimentos_hoje !== undefined) {
        setValorHoje(data.total_atendimentos_hoje);
      }
    },
    onOpen: () => {
      // Solicitar métricas quando a conexão for estabelecida
      sendMetricaRequest("total_atendimentos", "geral");
      sendMetricaRequest("total_atendimentos", "hoje");
    },
    autoConnect: true,
  });

  // Enviar requisição periodicamente
  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("total_atendimentos", "geral");
      sendMetricaRequest("total_atendimentos", "hoje");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Atendimentos</CardTitle>
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
              {isConnected ? valorHoje : <Spinner />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

TotalAtendimentos.displayName = "TotalAtendimentos";
