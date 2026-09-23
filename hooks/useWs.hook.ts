import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Props for the generic `useWs` WebSocket hook.
 *
 * @template TIn - Type of messages sent to the server.
 * @template TOut - Type of messages received from the server.
 */
export interface UseWsProps<TIn, TOut> {
  /** WebSocket URL. The auth token is appended as a query parameter by the hook. */
  url: string;
  /** Auth token used to authenticate the WebSocket connection. */
  token: string;
  /**
   * Message sent immediately after the socket opens.
   * Can be a value or a factory function. A factory is useful when the initial
   * message depends on the latest React state at connection time.
   */
  initialMessage?: TIn | (() => TIn | null | undefined);
  /** Whether the WebSocket connection is enabled. Defaults to `true`. */
  enabled?: boolean;
  /** Custom parser for raw incoming WebSocket data. Defaults to JSON parsing strings. */
  parseMessage?: (raw: unknown) => TOut;
  /**
   * Optional merge/reducer function for incoming messages.
   * If omitted, each incoming message replaces `lastMessage`.
   */
  onMessage?: (incoming: TOut, previous: TOut | null) => TOut;
  /** Called after the socket opens and the initial message is sent. */
  onOpen?: (ws: WebSocket) => void;
  /** Called when the socket closes. */
  onClose?: (event: CloseEvent) => void;
  /** Called when the socket encounters an error. */
  onError?: (event: Event) => void;
}

/**
 * Return value from the `useWs` hook.
 *
 * @template TIn - Type of messages sent to the server.
 * @template TOut - Type of messages received from the server.
 */
export interface UseWsReturn<TIn, TOut> {
  /** `true` when the WebSocket is open and connected. */
  isConnected: boolean;
  /** `true` while the WebSocket is attempting to connect. */
  isConnecting: boolean;
  /** Latest parsed/merged message, or `null` if no message has been received yet. */
  lastMessage: TOut | null;
  /** Sends a JSON-serialized message if the socket is open. Otherwise, does nothing. */
  sendMessage: (message: TIn) => void;
  /** Manually closes the WebSocket connection and resets connection state. */
  disconnect: () => void;
  /** Forces a fresh connection by disconnecting and reconnecting. */
  reconnect: () => void;
}

/**
 * Default parser for incoming WebSocket messages.
 * Parses strings as JSON; returns non-string data as-is.
 */
function defaultParseMessage<TOut>(raw: unknown): TOut {
  if (typeof raw === "string") return JSON.parse(raw) as TOut;
  return raw as TOut;
}

/**
 * Generic WebSocket hook.
 *
 * Handles connecting, disconnecting, sending messages, parsing incoming data,
 * and exposing the latest message through React state. It also keeps mutable
 * refs for callbacks so the connection is not recreated unnecessarily when
 * callback props change.
 *
 * @template TIn - Type of messages sent to the server.
 * @template TOut - Type of messages received from the server.
 */
export default function useWs<TIn, TOut>({
  url,
  token,
  initialMessage,
  enabled = true,
  parseMessage,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWsProps<TIn, TOut>): UseWsReturn<TIn, TOut> {
  // Stable reference to the active WebSocket instance.
  const wsRef = useRef<WebSocket | null>(null);

  // Connection status flags.
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Latest parsed/merged message received from the server.
  const [lastMessage, setLastMessage] = useState<TOut | null>(null);

  // Keep the latest props/callbacks in refs. This avoids stale closures and
  // prevents the connection effect from re-running when callbacks change.
  const initialMessageRef = useRef(initialMessage);
  const parseMessageRef = useRef(parseMessage);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  // Sync the initialMessage prop into its ref.
  useEffect(() => {
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);

  // Sync the parseMessage prop into its ref.
  useEffect(() => {
    parseMessageRef.current = parseMessage;
  }, [parseMessage]);

  // Sync the onMessage prop into its ref.
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Sync the onOpen prop into its ref.
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  // Sync the onClose prop into its ref.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Sync the onError prop into its ref.
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  /**
   * Resolves the initial message.
   * If `initialMessage` is a function, calls it to get the latest value.
   */
  const resolveInitialMessage = useCallback(() => {
    const value = initialMessageRef.current;

    return typeof value === "function"
      ? (value as () => TIn | null | undefined)()
      : value;
  }, []);

  /**
   * Sends a message to the server.
   * Serializes the message as JSON and only sends when the socket is open.
   */
  const sendMessage = useCallback((message: TIn) => {
    const ws = wsRef.current;

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, []);

  /**
   * Closes the WebSocket connection and resets connection state.
   */
  const disconnect = useCallback(() => {
    const ws = wsRef.current;

    if (ws) {
      ws.close();
      wsRef.current = null;
    }

    setIsConnecting(false);
    setIsConnected(false);
  }, []);

  /**
   * Creates a new WebSocket connection.
   * Does nothing when running outside the browser, when required values are
   * missing, or when the hook is disabled.
   */
  const connect = useCallback(() => {
    if (typeof window === "undefined" || !url || !token || !enabled) {
      return;
    }

    const current = wsRef.current;

    // Avoid creating duplicate connections.
    if (current?.readyState === WebSocket.OPEN) return;
    if (current?.readyState === WebSocket.CONNECTING) return;

    // Clean up any stale socket before creating a new one.
    if (current) {
      current.close();
      wsRef.current = null;
    }

    setIsConnecting(true);
    setIsConnected(false);

    // Append the auth token as a query parameter.
    const separator = url.includes("?") ? "&" : "?";
    const wsUrl = `${url}${separator}token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setIsConnected(true);

      // Send the initial message if one is provided.
      const initial = resolveInitialMessage();

      if (initial !== undefined && initial !== null) {
        ws.send(JSON.stringify(initial));
      }

      // Notify the consumer that the socket is open.
      onOpenRef.current?.(ws);
    };

    ws.onclose = (event) => {
      setIsConnecting(false);
      setIsConnected(false);
      onCloseRef.current?.(event);
    };

    ws.onerror = (event) => {
      setIsConnecting(false);
      setIsConnected(false);
      onErrorRef.current?.(event);
    };

    ws.onmessage = (event) => {
      try {
        // Use a custom parser when provided; otherwise use the default parser.
        const parse = parseMessageRef.current ?? defaultParseMessage<TOut>;
        const incoming = parse(event.data);

        // Replace or merge the latest message depending on `onMessage`.
        setLastMessage((previous) => {
          const merge = onMessageRef.current;
          return merge ? merge(incoming, previous) : incoming;
        });
      } catch (error) {
        console.error("useWs: failed to parse WebSocket message", error);
      }
    };
  }, [url, token, enabled, resolveInitialMessage]);

  /**
   * Forces a fresh connection by disconnecting and connecting again.
   */
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  // Connect on mount and whenever the connection dependencies change.
  // Clean up the socket when the component unmounts or dependencies change.
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect,
  };
}
