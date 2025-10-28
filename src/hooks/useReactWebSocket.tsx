import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { API_CONFIG } from "@/utils/config";

type Options<T> = {
  initialMessage?: any;
  autoAck?: boolean;
  onMessage?: (data: T) => void;
};

type UseReactWebSocketResult<T> = {
  data: T | null;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  sendMessage: (message: any) => boolean;
  readyState: ReadyState;
};

export function useReactWebSocket<T = any>(
  wsPath: string,
  options?: Options<T>
): UseReactWebSocketResult<T> {
  const { initialMessage, autoAck = true, onMessage } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Build a stable wsUrl and normalise slashes and protocol only once per wsPath
  const wsUrl = useMemo(() => {
    const base = (API_CONFIG.BASE_URL || "").replace(/\/+$/u, ""); // remove trailing slash
    const path = wsPath ? (wsPath.startsWith("/") ? wsPath : `/${wsPath}`) : "";
    return `${base}${path}`
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");
  }, [wsPath]);

  const sentInitialRef = useRef(false);

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(wsUrl, {
      onOpen: () => {
        // clear previous errors and mark as loading until first useful message
        setError(null);
        setIsError(false);
        // do not send initial message directly here — we'll do it in an effect
        // so we can guarantee it only runs once per connection
      },
      onError: (event: Event) => {
        console.error(`WebSocket error for ${wsPath}:`, event);
        setError("Erro na conexão WebSocket");
        setIsError(true);
        setIsLoading(false);
      },
      onClose: (event: CloseEvent) => {
        console.log(
          `WebSocket disconnected from ${wsPath}. Code: ${event.code}, Reason: ${event.reason}`
        );
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

  // Send the initial message once when the socket becomes OPEN
  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      initialMessage !== undefined &&
      !sentInitialRef.current
    ) {
      try {
        // prefer sendJsonMessage for objects so the server receives proper JSON
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

    // reset the "sentInitial" flag when the wsUrl changes -> new connection
    return () => {};
  }, [readyState, initialMessage, sendJsonMessage, sendMessage]);

  // Process incoming messages using lastMessage (safer with hooks)
  useEffect(() => {
    if (!lastMessage) return;

    setIsLoading(false);

    const raw = lastMessage.data;
    let parsed: any;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (err) {
      // If parsing fails, fall back to raw data
      console.error(`Error parsing WebSocket message for ${wsPath}:`, err);
      setError("Erro ao processar mensagem do servidor");
      setIsError(true);
      return;
    }

    setData(parsed);
    setIsError(false);
    setError(null);

    try {
      if (onMessage) onMessage(parsed as T);
    } catch (err) {
      console.error("onMessage callback threw an error:", err);
    }

    if (autoAck) {
      try {
        // send a simple ack as a raw string so server receives exactly "ack"
        sendMessage && sendMessage("ack");
      } catch (err) {
        console.warn("Failed to send ack:", err);
      }
    }
  }, [lastMessage, onMessage, autoAck, wsPath, sendMessage]);

  const isConnected = readyState === ReadyState.OPEN;

  const sendMessageWrapper = useCallback(
    (message: any) => {
      if (readyState !== ReadyState.OPEN) {
        console.warn("WebSocket not connected");
        return false;
      }

      try {
        if (typeof message === "string") {
          sendMessage && sendMessage(message);
        } else {
          // sendJsonMessage will JSON.stringify the payload
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
