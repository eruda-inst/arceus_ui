import { useCallback, useEffect, useRef, useState } from "react";
import {
  ErrorStats,
  SuccessStats,
  TodayAlwaysOut,
  TopDepartment,
  TopClient,
  TopEndpoint,
  TopHourFormatted,
  TopHttpMethod,
  TopMonthDay,
  TopSlowestEndpoint,
  TopStatusCode,
  TopWeekday,
  TopWorstEndpoint,
} from "@/types/metric.type";

export type MetricName =
  | "erros"
  | "sucessos"
  | "tempo_resposta"
  | "top_clientes"
  | "total_atendimentos"
  | "total_requisicoes"
  | "top_dias_mes"
  | "top_dias_semana"
  | "top_endpoints"
  | "top_endpoints_mais_lentos"
  | "top_horas"
  | "top_metodos_http"
  | "top_piores_endpoints"
  | "top_setores"
  | "top_status_codes";

export interface lastMessageType {
  erros?: TodayAlwaysOut<ErrorStats>;
  sucessos?: TodayAlwaysOut<SuccessStats>;
  tempo_resposta?: TodayAlwaysOut<{ min: number; avg: number; max: number }>;
  top_clientes?: TodayAlwaysOut<TopClient[]>;
  total_atendimentos?: TodayAlwaysOut<number>;
  total_requisicoes?: TodayAlwaysOut<number>;
  top_dias_mes?: TodayAlwaysOut<TopMonthDay[]>;
  top_dias_semana?: TodayAlwaysOut<TopWeekday[]>;
  top_endpoints?: TodayAlwaysOut<TopEndpoint[]>;
  top_endpoints_mais_lentos?: TodayAlwaysOut<TopSlowestEndpoint[]>;
  top_horas?: TodayAlwaysOut<TopHourFormatted[]>;
  top_metodos_http?: TodayAlwaysOut<TopHttpMethod[]>;
  top_piores_endpoints?: TodayAlwaysOut<TopWorstEndpoint[]>;
  top_setores?: TodayAlwaysOut<TopDepartment[]>;
  top_status_codes?: TodayAlwaysOut<TopStatusCode[]>;
}

export interface useMetricWebSocketProps {
  url: string;
  initialMetrics: MetricName[] | "all";
}

export interface useMetricWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: lastMessageType | null;
}

export default function useMetricWebSocket({
  url,
  initialMetrics,
}: useMetricWebSocketProps): useMetricWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<lastMessageType | null>(null);

  const connect = useCallback(() => {
    // Só executa no cliente e se houver URL
    if (typeof window === "undefined" || !url) return;

    // Se já existir uma conexão aberta, não cria outra
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Se já está em processo de conexão, não dispara outra tentativa
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    // Fecha qualquer conexão anterior (ex: em estado CLOSING ou CLOSED)
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Início da tentativa de conexão
    setIsConnecting(true);
    setIsConnected(false);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
      ws.send(
        JSON.stringify({ action: "enroll", metric_names: initialMetrics }),
      );
    };

    ws.onclose = () => {
      setIsConnecting(false);
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnecting(false);
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setLastMessage((prev) => ({ ...prev, ...newData }));
    };
  }, [url, initialMetrics]);

  // Efeito para abrir/fechar conexão
  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      // Reinicializar estados ao desmontar
      setIsConnecting(false);
      setIsConnected(false);
    };
  }, [connect]);

  return { isConnected, isConnecting, lastMessage };
}
