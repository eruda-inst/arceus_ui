"use client";

import { useState, useEffect } from "react";
import { API_CONFIG } from "@/utils/config";

export function useWebSocket<T>(wsPath: string) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${API_CONFIG.BASE_URL}${wsPath}`);

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      setIsError(false);
      console.log(`WebSocket connected: ${wsPath}`);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
        // Received first successful message -> loading finished
        setIsLoading(false);
        // Envia acknowledgement apenas se necessário
        if (ws.readyState === WebSocket.OPEN) {
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

      // Tentativa de reconexão após 3 segundos
      setTimeout(() => {
        setError("Tentando reconectar...");
      }, 3000);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [wsPath]);

  return { data, isConnected, error, isLoading, isError };
}
