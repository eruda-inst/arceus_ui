"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { API_CONFIG } from "@/config/config";

type Options<T> = {
  initialMessage?: unknown;
  autoAck?: boolean;
  onMessage?: (data: T) => void;
};

type UseReactWebSocketResult<T> = {
  data: T | null;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  sendMessage: (message: unknown) => boolean;
  readyState: ReadyState;
};

export function useReactWebSocket<T = unknown>(
  wsPath: string,
  options?: Options<T>
): UseReactWebSocketResult<T> {
  const { initialMessage, autoAck = true, onMessage } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const wsUrl = useMemo(() => {
    const base = (API_CONFIG.BASE_URL || "").replace(/\/+$/u, "");
    const path = wsPath ? (wsPath.startsWith("/") ? wsPath : `/${wsPath}`) : "";
    return `${base}${path}`
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");
  }, [wsPath]);

  const sentInitialRef = useRef(false);

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(wsUrl, {
      onOpen: () => {
        setError(null);
        setIsError(false);
      },
      onError: (event: Event) => {
        console.error(`WebSocket error for ${wsPath}:`, event);
        setError("Erro na conexão WebSocket");
        setIsError(true);
        setIsLoading(false);
      },
      onClose: (event: CloseEvent) => {
        setIsLoading(false);
        setIsError(true);
        if (event.code === 1006) {
          setError("Conexão perdida. Tentando reconectar...");
        } else {
          setError("Conexão fechada. Tentando reconectar...");
        }
      },
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    });

  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      initialMessage !== undefined &&
      !sentInitialRef.current
    ) {
      try {
        if (typeof initialMessage === "string") {
          sendMessage && sendMessage(initialMessage);
        } else {
          sendJsonMessage && sendJsonMessage(initialMessage);
        }
        sentInitialRef.current = true;
      } catch (err) {
        console.error("Failed to send initial message", err);
      }
    }

    return () => {};
  }, [readyState, initialMessage, sendJsonMessage, sendMessage]);

  useEffect(() => {
    if (!lastMessage) return;

    setIsLoading(false);

    const raw = lastMessage.data;
    let parsed: T;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (err) {
      console.error(`Error parsing WebSocket message for ${wsPath}:`, err);
      setError("Erro ao processar mensagem do servidor");
      setIsError(true);
      return;
    }

    setData(parsed);
    setIsError(false);
    setError(null);

    try {
      if (onMessage) onMessage(parsed);
    } catch (err) {
      console.error("onMessage callback threw an error:", err);
    }

    if (autoAck) {
      try {
        sendMessage && sendMessage("ack");
      } catch (err) {
        console.warn("Failed to send ack:", err);
      }
    }
  }, [lastMessage, onMessage, autoAck, wsPath, sendMessage]);

  const isConnected = readyState === ReadyState.OPEN;

  const sendMessageWrapper = useCallback(
    (message: unknown) => {
      if (readyState !== ReadyState.OPEN) {
        console.warn("WebSocket not connected");
        return false;
      }

      try {
        if (typeof message === "string") {
          sendMessage && sendMessage(message);
        } else {
          sendJsonMessage && sendJsonMessage(message);
        }
        return true;
      } catch (err) {
        console.error("Failed to send message over WebSocket:", err);
        return false;
      }
    },
    [readyState, sendJsonMessage, sendMessage]
  );

  return {
    data,
    isConnected,
    error,
    isLoading,
    isError,
    sendMessage: sendMessageWrapper,
    readyState,
  };
}
