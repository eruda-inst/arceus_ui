"use client";

import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "@/utils/config";

export function useWebSocket<T>(
  wsPath: string,
  options?: {
    initialMessage?: any;
    autoAck?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const { initialMessage, autoAck = true } = options || {};

  useEffect(() => {
    const ws = new WebSocket(`${API_CONFIG.BASE_URL}${wsPath}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      setIsError(false);
      console.log(`WebSocket connected: ${wsPath}`);

      if (initialMessage && ws.readyState === WebSocket.OPEN) {
        const message =
          typeof initialMessage === "string"
            ? initialMessage
            : JSON.stringify(initialMessage);
        ws.send(message);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
        setIsLoading(false);

        if (autoAck && ws.readyState === WebSocket.OPEN) {
          ws.send("ack");
        }
      } catch (err) {
        console.error(`Error processing message for ${wsPath}:`, err);
        setError("Erro ao processar mensagem do servidor");
        setIsError(true);
        setIsLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${wsPath}:`, error);
      setError("Erro na conexão WebSocket");
      setIsError(true);
      setIsLoading(false);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log(
        `WebSocket disconnected: ${wsPath}`,
        event.code,
        event.reason
      );

      setTimeout(() => {
        setError("Tentando reconectar...");
      }, 3000);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [wsPath, initialMessage, autoAck]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const formattedMessage =
        typeof message === "string" ? message : JSON.stringify(message);
      wsRef.current.send(formattedMessage);
      return true;
    }
    console.warn("WebSocket not connected");
    return false;
  };

  return {
    data,
    isConnected,
    error,
    isLoading,
    isError,
    sendMessage,
  };
}
