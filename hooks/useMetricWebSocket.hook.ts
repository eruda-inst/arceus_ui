"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ErrorStatsType,
  SuccessStatsType,
  TodayAlwaysOutType,
  TopDepartmentType,
  TopClientType,
  TopEndpointType,
  TopHourFormattedType,
  TopHttpMethodType,
  TopMonthDayType,
  TopSlowestEndpointType,
  TopStatusCodeType,
  TopWeekdayType,
  TopWorstEndpointType,
} from "@/types/metric.type";

// Union type of all available metric names
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

// Type representing the structure of messages received from the server
// Each key corresponds to a metric and contains its data wrapped in TodayAlwaysOutType
export interface lastMessageType {
  erros?: TodayAlwaysOutType<ErrorStatsType>;
  sucessos?: TodayAlwaysOutType<SuccessStatsType>;
  tempo_resposta?: TodayAlwaysOutType<{
    min: number;
    avg: number;
    max: number;
  }>;
  top_clientes?: TodayAlwaysOutType<TopClientType[]>;
  total_atendimentos?: TodayAlwaysOutType<number>;
  total_requisicoes?: TodayAlwaysOutType<number>;
  top_dias_mes?: TodayAlwaysOutType<TopMonthDayType[]>;
  top_dias_semana?: TodayAlwaysOutType<TopWeekdayType[]>;
  top_endpoints?: TodayAlwaysOutType<TopEndpointType[]>;
  top_endpoints_mais_lentos?: TodayAlwaysOutType<TopSlowestEndpointType[]>;
  top_horas?: TodayAlwaysOutType<TopHourFormattedType[]>;
  top_metodos_http?: TodayAlwaysOutType<TopHttpMethodType[]>;
  top_piores_endpoints?: TodayAlwaysOutType<TopWorstEndpointType[]>;
  top_setores?: TodayAlwaysOutType<TopDepartmentType[]>;
  top_status_codes?: TodayAlwaysOutType<TopStatusCodeType[]>;
}

// Props fot he metric WebSocket hook
export interface useMetricWebSocketProps {
  url: string;
  initialMetrics: MetricName[] | "all";
}

// Return type of the hook
export interface useMetricWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: lastMessageType | null;
}

/**
 * Custom hook that establishes a WebSocket connection for real‑time metrics.
 * Upon connection, it sends an "enroll" message to subscribe to the specified metrics.
 *
 * @param url - WebSocket endpoint
 * @param initialMetrics - array of metric names or "all" to subscribe to all metrics
 * @returns connection state and the last received message
 */
export default function useMetricWebSocket({
  url,
  initialMetrics,
}: useMetricWebSocketProps): useMetricWebSocketReturn {
  // Reference to the WebSocket instance
  const wsRef = useRef<WebSocket | null>(null);

  // Connection states
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Last message received from the server (contains one or more metrics)
  const [lastMessage, setLastMessage] = useState<lastMessageType | null>(null);

  /**
   * Establish the WebSocket connection and set up event handlers.
   * On open, it sends an "enroll" message with the requested metric names.
   */
  const connect = useCallback(() => {
    // Avoid running on the server (SSR)
    if (typeof window === "undefined" || !url) return;

    // Prevent duplicate connections
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    // Close any existing connection (e.g., in CLOSING or CLOSED state)
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Update connection status
    setIsConnecting(true);
    setIsConnected(false);

    // Create the WebSocket
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
      // Send subscription request with the desired metric names
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
      // Merge new data with previous message (assumes incremental updates)
      setLastMessage((prev) => ({ ...prev, ...newData }));
    };
  }, [url, initialMetrics]);

  // Automatically connect when the component mounts, and clean up on unmount
  useEffect(() => {
    connect();

    return () => {
      // Close the WebSocket and reset state on component unmount
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnecting(false);
      setIsConnected(false);
    };
  }, [connect]);

  return { isConnected, isConnecting, lastMessage };
}
