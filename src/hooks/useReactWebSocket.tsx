import { useState, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { API_CONFIG } from "@/utils/config";

export function useReactWebSocket<T>(
  wsPath: string,
  options?: {
    initialMessage?: any;
    autoAck?: boolean;
    onMessage?: (data: T) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { initialMessage, autoAck = true, onMessage } = options || {};

  // Substituir http por ws para WebSocket
  const wsUrl = `${API_CONFIG.BASE_URL}${wsPath}`
    .replace("http://", "ws://")
    .replace("https://", "wss://");

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    onOpen: () => {
      setError(null);
      setIsError(false);

      if (initialMessage) {
        const message =
          typeof initialMessage === "string"
            ? initialMessage
            : JSON.stringify(initialMessage);
        sendMessage(message);
      }
    },
    onMessage: (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
        setIsLoading(false);

        if (onMessage) {
          onMessage(message);
        }

        if (autoAck) {
          sendMessage("ack");
        }
      } catch (err) {
        console.error(`Error processing message for ${wsPath}:`, err);
        setError("Erro ao processar mensagem do servidor");
        setIsError(true);
        setIsLoading(false);
      }
    },
    onError: (error: Event) => {
      console.error(`WebSocket error for ${wsPath}:`, error);
      setError("Erro na conexão WebSocket");
      setIsError(true);
      setIsLoading(false);
    },
    onClose: () => {
      setError("Tentando reconectar...");
    },
    shouldReconnect: (closeEvent: CloseEvent) => true,
    reconnectInterval: 3000,
  });

  const isConnected = readyState === ReadyState.OPEN;

  const sendMessageWrapper = useCallback(
    (message: any) => {
      if (readyState === ReadyState.OPEN) {
        const formattedMessage =
          typeof message === "string" ? message : JSON.stringify(message);
        sendMessage(formattedMessage);
        return true;
      }
      console.warn("WebSocket not connected");
      return false;
    },
    [readyState, sendMessage]
  );

  return {
    data,
    isConnected,
    error,
    isLoading,
    isError,
    sendMessage: sendMessageWrapper,
  };
}
