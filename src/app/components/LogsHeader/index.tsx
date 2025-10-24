interface LogsHeaderProps {
  totalLogs: number;
  isConnected: boolean;
}

export function LogsHeader({ totalLogs, isConnected }: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Logs do Sistema</h1>
        <p className="text-sm mt-1">
          Total de <span className="font-medium">{totalLogs}</span> requisições
          registradas
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">
          {isConnected ? "Conectado" : "Desconectado"}
        </span>
      </div>
    </div>
  );
}

LogsHeader.displayName = "LogsHeader";
