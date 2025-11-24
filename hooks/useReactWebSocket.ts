"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

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
  rota: string,
  options?: Options<T>
): UseReactWebSocketResult<T> {
  const { initialMessage, autoAck = true, onMessage } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shouldConnect = !!rota;
  const [isLoading, setIsLoading] = useState(shouldConnect);
  const [isError, setIsError] = useState(false);

  const sentInitialRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    sentInitialRef.current = false;
  }, [rota]);

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(shouldConnect ? rota : null, {
      onOpen: () => {
        if (!shouldConnect) return;
        setError(null);
        setIsError(false);
        setIsLoading(false);
      },
      onError: (event: Event) => {
        if (!shouldConnect) return;
        console.error(`WebSocket error for ${rota}:`, event);
        if (mountedRef.current) {
          setError("Erro na conexão WebSocket");
          setIsError(true);
          setIsLoading(false);
        }
      },
      onClose: (event: CloseEvent) => {
        if (!shouldConnect) return;
        sentInitialRef.current = false;

        if (!mountedRef.current) return;

        setIsLoading(false);

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
      shouldReconnect: () => shouldConnect, // Só reconecta se dever conectar
      reconnectInterval: 3000,
    });

  // Queue for outgoing messages when socket is not open.
  const outboundQueueRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (!shouldConnect) {
      setIsLoading(false);
      return;
    }

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
  }, [readyState, shouldConnect]);

  // Flush queued outbound messages when connection opens
  useEffect(() => {
    if (!shouldConnect) return;
    if (readyState !== ReadyState.OPEN) return;

    if (outboundQueueRef.current.length === 0) return;

    try {
      outboundQueueRef.current.forEach((msg) => {
        if (typeof msg === "string") {
          sendMessage && sendMessage(msg);
        } else {
          sendJsonMessage && sendJsonMessage(msg);
        }
      });
    } catch (err) {
      console.warn("Failed to flush outbound message queue:", err);
    } finally {
      outboundQueueRef.current = [];
    }
  }, [readyState, shouldConnect, sendJsonMessage, sendMessage]);

  useEffect(() => {
    if (
      shouldConnect &&
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
  }, [readyState, initialMessage, sendJsonMessage, sendMessage, shouldConnect]);

  useEffect(() => {
    if (!lastMessage || !shouldConnect) return;
    if (!mountedRef.current) return;

    setIsLoading(false);

    const raw = lastMessage.data;

    (async () => {
      try {
        let parsed: T;

        if (typeof raw === "string") {
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
        console.error(`Error processing WebSocket message for ${rota}:`, err);
        if (!mountedRef.current) return;
        setError("Erro ao processar mensagem do servidor");
        setIsError(true);
      }
    })();
  }, [lastMessage, onMessage, autoAck, rota, sendMessage, shouldConnect]);

  const isConnected = readyState === ReadyState.OPEN && shouldConnect;

  const sendMessageWrapper = useCallback(
    (message: unknown) => {
      if (readyState !== ReadyState.OPEN || !shouldConnect) {
        // queue message for later delivery
        outboundQueueRef.current.push(message);
        console.info("WebSocket not connected — queued outbound message");
        return true;
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
    [readyState, sendJsonMessage, sendMessage, shouldConnect]
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
