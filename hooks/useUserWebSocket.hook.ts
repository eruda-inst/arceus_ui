import { useCallback, useEffect, useRef, useState } from "react";
import { UserParamsInSchema } from "@/schemas/user.schema";
import { UserListOutType, UserParamsInType } from "@/types/user.type";

/**
 * Props for the user WebSocket hook.
 */
export interface useUserWebSocketProps {
  /** WebSocket endpoint URL */
  url: string;
  /** Initial filter/pagination parameters (optional – defaults applied via Zod) */
  initialParams?: UserParamsInType;
}

/**
 * Return type of the useUserWebSocket hook.
 */
export interface useUserWebSocketReturn {
  /** Whether the WebSocket connection is currently open */
  isConnected: boolean;
  /** Whether the WebSocket is in the process of connecting */
  isConnecting: boolean;
  /** The most recent message received from the server (user pagination data) */
  lastMessage: UserListOutType | null;
  /** Function to send new filter/pagination parameters to the server */
  sendMessage: (params: UserParamsInType) => void;
}

/**
 * Custom hook to manage a WebSocket connection for user data streaming.
 * It establishes a connection, sends initial parameters on open,
 * and provides a send function to update the query.
 *
 * @param url - WebSocket endpoint
 * @param initialParams - initial filter/pagination parameters (optional)
 * @returns connection state, last received message, and a send function
 */
export default function useUserWebSocket({
  url,
  initialParams,
}: useUserWebSocketProps): useUserWebSocketReturn {
  // Reference to the WebSocket instance
  const wsRef = useRef<WebSocket | null>(null);

  // Connection states
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Last message received from the server
  const [lastMessage, setLastMessage] = useState<UserListOutType | null>(null);

  /**
   * Send a message (query parameters) to the server if the WebSocket is open.
   * The payload format is the plain parameters object as expected by the backend.
   */
  const sendMessage = useCallback((params: UserParamsInType) => {
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
    const paramsToSend = UserParamsInSchema.parse(initialParams ?? {});

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
      // Replace last message entirely
      setLastMessage(newData);
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
