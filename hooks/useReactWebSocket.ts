"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface UseOptimizedWebSocketResult<T> {
  data: T | null;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  sendMessage: (message: string | object) => boolean;
  readyState: ReadyState;
}

export function useReactWebSocket<T = unknown>(
  rota: string,
  options?: {
    throttleInterval?: number;
    enabled?: boolean;
    autoAck?: boolean;
    onMessage?: (data: T) => void;
  }
): UseOptimizedWebSocketResult<T> {
  const {
    throttleInterval = 1000,
    enabled = true,
    autoAck = true,
    onMessage,
  } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const lastUpdateRef = useRef<number>(0);
  const dataQueueRef = useRef<T | null>(null);
  const mountedRef = useRef(true);

  const shouldConnect = !!rota && enabled;

  const {
    sendMessage: originalSendMessage,
    sendJsonMessage: originalSendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(shouldConnect ? rota : null, {
    shouldReconnect: () => shouldConnect,
    reconnectInterval: (attemptCount) =>
      Math.min(1000 * Math.pow(2, attemptCount), 30000),
    reconnectAttempts: 10,
    onError: (event: Event) => {
      console.error(`WebSocket error for ${rota}:`, event);
      if (mountedRef.current) {
        setError("Erro na conexão WebSocket");
        setIsError(true);
        setIsLoading(false);
      }
    },
    onOpen: () => {
      if (mountedRef.current) {
        setError(null);
        setIsError(false);
        setIsLoading(false);
      }
    },
    onClose: () => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    },
  });

  // Fila para mensagens de saída
  const outboundQueueRef = useRef<Array<string | object>>([]);

  // Função sendMessage corrigida
  const sendMessage = useCallback(
    (message: string | object): boolean => {
      if (!shouldConnect) {
        console.warn("Tentativa de enviar mensagem com WebSocket desabilitado");
        return false;
      }

      if (readyState === ReadyState.OPEN) {
        try {
          if (typeof message === "string") {
            originalSendMessage(message);
          } else {
            originalSendJsonMessage(message);
          }
          return true;
        } catch (err) {
          console.error("Erro ao enviar mensagem:", err);
          return false;
        }
      } else {
        // Adiciona à fila se não estiver conectado
        outboundQueueRef.current.push(message);
        console.info("Mensagem enfileirada - WebSocket não conectado");
        return true;
      }
    },
    [readyState, shouldConnect, originalSendMessage, originalSendJsonMessage]
  );

  // Processar fila de mensagens quando conectar
  useEffect(() => {
    if (readyState === ReadyState.OPEN && outboundQueueRef.current.length > 0) {
      const queue = [...outboundQueueRef.current];
      outboundQueueRef.current = [];

      queue.forEach((message) => {
        if (typeof message === "string") {
          originalSendMessage(message);
        } else {
          originalSendJsonMessage(message);
        }
      });
    }
  }, [readyState, originalSendMessage, originalSendJsonMessage]);

  // Processar mensagens com throttling
  const processMessage = useCallback(
    (messageData: T) => {
      if (!mountedRef.current) return;

      const now = Date.now();

      if (now - lastUpdateRef.current >= throttleInterval) {
        setData(messageData);
        lastUpdateRef.current = now;
        dataQueueRef.current = null;

        if (onMessage) {
          onMessage(messageData);
        }
      } else {
        dataQueueRef.current = messageData;
      }
    },
    [throttleInterval, onMessage]
  );

  // Processar mensagens enfileiradas
  useEffect(() => {
    if (!dataQueueRef.current) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= throttleInterval) {
      setData(dataQueueRef.current);
      lastUpdateRef.current = now;

      if (onMessage && dataQueueRef.current) {
        onMessage(dataQueueRef.current);
      }
      dataQueueRef.current = null;
    }
  }, [data, throttleInterval, onMessage]);

  // Processar mensagens recebidas
  useEffect(() => {
    if (!lastMessage || !shouldConnect) return;
    if (!mountedRef.current) return;

    const processWebSocketMessage = async () => {
      try {
        const raw = lastMessage.data;
        let parsed: T;

        if (typeof raw === "string") {
          parsed = JSON.parse(raw) as T;
        } else if (raw instanceof Blob) {
          const text = await raw.text();
          parsed = JSON.parse(text) as T;
        } else {
          parsed = raw as T;
        }

        processMessage(parsed);

        if (mountedRef.current) {
          setIsError(false);
          setError(null);
        }

        // Enviar ACK se necessário
        if (autoAck) {
          sendMessage("ack");
        }
      } catch (err) {
        console.error(
          `Erro ao processar mensagem WebSocket para ${rota}:`,
          err
        );
        if (mountedRef.current) {
          setError("Erro ao processar mensagem do servidor");
          setIsError(true);
        }
      }
    };

    processWebSocketMessage();
  }, [lastMessage, rota, shouldConnect, processMessage, autoAck, sendMessage]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isConnected = readyState === ReadyState.OPEN && shouldConnect;

  return {
    data,
    isConnected,
    error,
    isLoading,
    isError,
    sendMessage,
    readyState,
  };
}
