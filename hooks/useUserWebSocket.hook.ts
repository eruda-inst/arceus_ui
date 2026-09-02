import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";
import { UserPaginationOut } from "@/types/user.type";

export const UserParamsSchema = z.object({
  pagina: z.int().min(1).default(1).optional(),
  itens_por_pagina: z.int().min(1).max(100).default(10).optional(),

  nome: z.string().optional(),
  email: z.string().optional(),
  ativo: z.boolean().optional(),
  nome_grupo: z.string().optional(),
});

export type UserParamsType = z.infer<typeof UserParamsSchema>;

export interface useUserWebSocketProps {
  url: string;
  initialParams?: UserParamsType;
}

export interface useUserWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: UserPaginationOut | null;
  sendMessage: (params: UserParamsType) => void;
}

export default function useUserWebSocket({
  url,
  initialParams,
}: useUserWebSocketProps): useUserWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const [lastMessage, setLastMessage] = useState<UserPaginationOut | null>(
    null,
  );

  const sendMessage = useCallback((params: UserParamsType) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(params));
    }
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !url) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnecting(true);
    setIsConnected(false);

    const paramsToSend = UserParamsSchema.parse(initialParams ?? {});

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);
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
      setLastMessage(newData);
    };
  }, [url, initialParams]);

  useEffect(() => {
    connect();

    return () => {
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
