// Atualize o hook abaixo para ficar requisitando a cada 500ms todas as métricas, para implementação de real-time (atualmente o back-end só realiza broadcast quando uma nova requisição chega, i.e., não é broadcast, apesar de ser websocket)

// Tente implementar algum mecanismo inteligente aqui que não pese tanto na performance

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { obterTokenAutenticacao } from "@/helpers/misc";

type WebSocketMessage = {
  [key: string]: any;
  erro?: string;
};

type WebSocketRequest = {
  metrica: string;
  periodo?: string;
  [key: string]: any;
};

type UseMetricaWebSocketOptions = {
  onMessage?: (data: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
  requirePermission?: string;
};

export const useMetricaWebSocket = (
  options: UseMetricaWebSocketOptions = {},
) => {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    autoConnect = true,
    requirePermission = "ver_metricas",
  } = options;

  const [token, setToken] = useState(obterTokenAutenticacao());
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  // Armazenar as callbacks em refs para evitar reconstrução
  const callbacksRef = useRef({
    onMessage,
    onOpen,
    onClose,
    onError,
  });

  // Atualizar as callbacks quando mudarem
  useEffect(() => {
    callbacksRef.current = {
      onMessage,
      onOpen,
      onClose,
      onError,
    };
  }, [onMessage, onOpen, onClose, onError]);

  // Função de conexão que não muda entre renderizações
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (!token) {
      setError("Token de autenticação não encontrado");
      return;
    }

    // Construir URL com permissão se especificada
    let wsUrl = `ws://localhost:8000/api/v1/ws/metricas/?token=${token}`;
    if (requirePermission) {
      wsUrl += `&permission=${encodeURIComponent(requirePermission)}`;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket conectado para métricas");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        if (callbacksRef.current.onOpen) callbacksRef.current.onOpen();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;

          if (data.erro) {
            setError(`Erro: ${data.erro}`);
            return;
          }

          if (callbacksRef.current.onMessage) {
            callbacksRef.current.onMessage(data);
          }
        } catch (err) {
          console.error("Erro ao processar mensagem WebSocket:", err);
          setError("Erro ao processar resposta do servidor");
        }
      };

      ws.onerror = (errorEvent) => {
        console.error("Erro no WebSocket:", errorEvent);
        setError("Erro na conexão com o servidor de métricas");

        if (callbacksRef.current.onError)
          callbacksRef.current.onError(errorEvent);
      };

      ws.onclose = (event) => {
        console.log("WebSocket desconectado", event.code, event.reason);
        setIsConnected(false);

        if (callbacksRef.current.onClose) callbacksRef.current.onClose();

        // Tentar reconectar se não foi um fechamento intencional
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttemptsRef.current += 1;

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Tentando reconectar... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
            );
            connect();
          }, RECONNECT_DELAY * reconnectAttemptsRef.current);
        }
      };
    } catch (err) {
      console.error("Erro ao criar WebSocket:", err);
      setError("Não foi possível criar a conexão WebSocket");
    }
  }, [requirePermission]);

  // Função de desconexão que não muda
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Desconexão manual");
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  // Função para enviar requisições
  const sendRequest = useCallback((request: WebSocketRequest) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket não está conectado");
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(request));
      return true;
    } catch (err) {
      console.error("Erro ao enviar mensagem WebSocket:", err);
      setError("Erro ao enviar solicitação");
      return false;
    }
  }, []);

  // Função especializada para enviar métricas
  const sendMetricaRequest = useCallback(
    (
      metrica: string,
      periodo?: string,
      additionalParams?: Record<string, any>,
    ) => {
      const request: WebSocketRequest = {
        metrica,
        ...(periodo && { periodo }),
        ...additionalParams,
      };

      return sendRequest(request);
    },
    [sendRequest],
  );

  // Efeito para gerenciar a conexão
  useEffect(() => {
    let mounted = true;

    if (autoConnect && mounted) {
      connect();
    }

    return () => {
      mounted = false;
      disconnect();
    };
    // Apenas autoConnect é dependência, as funções são estáveis
  }, [autoConnect, connect, disconnect]);

  // Função para reconectar manualmente
  const reconectar = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setError(null);

    // Pequeno delay antes de reconectar
    setTimeout(() => {
      connect();
    }, 500);
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    sendRequest,
    sendMetricaRequest,
    reconectar,
    disconnect,
    connect,
  };
};
