interface LoadingStateProps {
  isConnected: boolean;
}

export function LoadingState({ isConnected }: LoadingStateProps) {
  return (
    <div className="p-6 bg-(--bg-light) dark:bg-(--bg-dark) border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logs do Sistema</h1>
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
      <div className="flex justify-center items-center h-64">
        <div>Carregando logs...</div>
      </div>
    </div>
  );
}

LoadingState.displayName = "LoadingState";
