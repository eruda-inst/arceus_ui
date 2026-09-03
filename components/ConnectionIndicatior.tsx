import clsx from "clsx";
import { ColorSwatch } from "@heroui/react";

export interface ConnectionIndicatorProps {
  isConnected?: boolean;
  isConnecting?: boolean;
}

export default function ConnectionIndicatior({
  isConnected = false,
  isConnecting = false,
}: ConnectionIndicatorProps) {
  return (
    <span
      className={clsx(
        "flex items-center gap-x-2",
        isConnecting
          ? "text-blue-500"
          : isConnected
            ? "text-green-500"
            : "text-red-500",
      )}
    >
      {isConnecting
        ? "Conectando..."
        : isConnected
          ? "Conectado"
          : "Desconectado"}
      <ColorSwatch
        className="animate-pulse"
        size="xs"
        color={isConnecting ? "#00f" : isConnected ? "#0f0" : "#f00"}
      />
    </span>
  );
}
