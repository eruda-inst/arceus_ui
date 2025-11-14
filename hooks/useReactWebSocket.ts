"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { API_CONFIG } from "@/config/config";

type Options<T> = {
  initialMessage?: unknown | (() => unknown);
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
    // note: dependency intentionally just wsPath
  }, [wsPath]);

  const sentInitialRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset sentInitial when wsUrl changes so a new connection can send initial message again
  useEffect(() => {
    sentInitialRef.current = false;
  }, [wsUrl]);

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(wsUrl, {
      onOpen: () => {
        // connection opened
        setError(null);
        setIsError(false);
        setIsLoading(false);
      },
      onError: (event: Event) => {
        console.error(`WebSocket error for ${wsPath}:`, event);
        if (mountedRef.current) {
          setError("Erro na conexão WebSocket");
          setIsError(true);
          setIsLoading(false);
        }
      },
      onClose: (event: CloseEvent) => {
        // reset initial-sent flag so next successful open will re-send initialMessage if needed
        sentInitialRef.current = false;

        if (!mountedRef.current) return;

        setIsLoading(false);

        // treat a clean/normal close (1000) as non-error
        if (event.code === 1000 || event.wasClean) {
          setIsError(false);
          setError(null);
        } else {
          setIsError(true);
          if (event.code === 1006) {
            setError("Conexão perdida. Tentando reconectar...");
          } else {
            setError("Conexão fechada. Tentando reconectar...");
          }
        }
      },
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    });

  // reflect readyState -> isLoading
  useEffect(() => {
    if (!mountedRef.current) return;
    if (readyState === ReadyState.CONNECTING) {
      setIsLoading(true);
    } else if (readyState === ReadyState.OPEN) {
      setIsLoading(false);
    } else if (
      readyState === ReadyState.CLOSING ||
      readyState === ReadyState.CLOSED
    ) {
      setIsLoading(false);
    }
  }, [readyState]);

  // send initial message when connection opens (and not yet sent for this connection)
  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      initialMessage !== undefined &&
      !sentInitialRef.current
    ) {
      const payload =
        typeof initialMessage === "function"
          ? (initialMessage as () => unknown)()
          : initialMessage;

      try {
        if (typeof payload === "string") {
          sendMessage && sendMessage(payload);
        } else {
          sendJsonMessage && sendJsonMessage(payload);
        }
        sentInitialRef.current = true;
      } catch (err) {
        console.error("Failed to send initial message", err);
      }
    }
    // intentionally not returning anything
  }, [readyState, initialMessage, sendJsonMessage, sendMessage]);

  // handle incoming messages (supports string, Blob, ArrayBuffer, and raw object)
  useEffect(() => {
    if (!lastMessage) return;
    if (!mountedRef.current) return;

    setIsLoading(false);

    const raw = lastMessage.data;

    (async () => {
      try {
        let parsed: T;

        if (typeof raw === "string") {
          // try parse JSON but fallback to raw string
          try {
            parsed = JSON.parse(raw) as T;
          } catch {
            parsed = raw as unknown as T;
          }
        } else if (raw instanceof Blob) {
          const text = await raw.text();
          try {
            parsed = JSON.parse(text) as T;
          } catch {
            parsed = text as unknown as T;
          }
        } else if (raw instanceof ArrayBuffer) {
          const text = new TextDecoder().decode(new Uint8Array(raw));
          try {
            parsed = JSON.parse(text) as T;
          } catch {
            parsed = text as unknown as T;
          }
        } else {
          // non-standard / already-parsed object
          parsed = raw as T;
        }

        if (!mountedRef.current) return;

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
      } catch (err) {
        console.error(`Error processing WebSocket message for ${wsPath}:`, err);
        if (!mountedRef.current) return;
        setError("Erro ao processar mensagem do servidor");
        setIsError(true);
      }
    })();
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
