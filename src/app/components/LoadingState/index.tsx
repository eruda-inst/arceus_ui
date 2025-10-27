import { Mensagem } from "@/app/components/Mensagem";

interface LoadingStateProps {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function LoadingState({
  isConnected,
  isLoading,
  isError,
}: LoadingStateProps) {
  return (
    <div className="p-6 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg shadow">
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
        {isLoading ? (
          <Mensagem className="text-center">Carregando...</Mensagem>
        ) : (
          isError && (
            <Mensagem className="text-center text-red-500">Erro</Mensagem>
          )
        )}
      </div>
    </div>
  );
}

LoadingState.displayName = "LoadingState";
