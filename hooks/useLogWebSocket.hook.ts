import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";
import { LogPaginationOut } from "@/types/log.type";

// Zod schema for validating and typing log query parameters
export const LogParamsSchema = z.object({
  // Pagination
  pagina: z.int().min(1).default(1).optional(),
  itens_por_pagina: z.int().min(1).max(100).default(10).optional(),

  // Filtering (all optional)
  metodo: z.string().optional(),
  endpoint: z.string().optional(),
  codigo: z.number().positive().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  hora_inicio: z.string().optional(),
  hora_fim: z.string().optional(),
  protocolo: z.string().optional(),
  setor: z.string().optional(),
  nome_cliente: z.string().optional(),
});

// Infer the TypeScript type from the Zod schema
export type LogParamsType = z.infer<typeof LogParamsSchema>;

// Props for the WebSocket hook
export interface useLogWebSocketProps {
  url: string;
  initialParams?: LogParamsType; // optional – defaults will be applied via Zod
}

// Return type of the hook
export interface useLogWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: LogPaginationOut | null;
  sendMessage: (params: LogParamsType) => void;
}

/**
 * Custom hook to manage a WebSocket connection for log streaming.
 *
 * @param url - WebSocket endpoint
 * @param initialParams - initial filter/pagination parameters (optional)
 * @returns connection state, last received message, and a send function
 */
export default function useLogWebSocket({
  url,
  initialParams,
}: useLogWebSocketProps): useLogWebSocketReturn {
  // Reference to the WebSocket instance
  const wsRef = useRef<WebSocket | null>(null);

  // Connection states
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Last message received from the server
  const [lastMessage, setLastMessage] = useState<LogPaginationOut | null>(null);

  /**
   * Send a message (query parameters) to the server if the WebSocket is open.
   * The payload format is { params: ... } to match the backend expectation.
   */
  const sendMessage = useCallback((params: LogParamsType) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(params));
    }
  }, []);

  /**
   * Establish the WebSocket connection and set up event handlers.
   * Uses Zod to parse and apply defaults to initialParams.
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

    // Apply Zod defaults even if initialParams is undefined or incomplete
    const paramsToSend = LogParamsSchema.parse(initialParams ?? {});

    // Create the WebSocket
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
      // Send the initial params as soon as the connection opens
      ws.send(JSON.stringify(paramsToSend));
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
      // Merge new data with previous message (adjust if you want to replace entirely)
      setLastMessage((prev) => ({ ...prev, ...newData }));
    };
  }, [url, initialParams]);

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

  return { isConnected, isConnecting, lastMessage, sendMessage };
}
