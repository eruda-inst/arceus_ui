import { Log } from "@/app/components/Log";
import { Mensagem } from "@/app/components/Mensagem";
import { Card } from "@/app/components/Card";
import { API_CONFIG } from "@/utils/config";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Log as LogType } from "@/utils/type/log";

interface RequisicoesRecentesOut {
  requisicoes_recentes: LogType[];
}

export function RequisicoesRecentes() {
  const { data, isError, isLoading } =
    useReactWebSocket<RequisicoesRecentesOut>(
      API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES
    );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Requisições Recentes
      </h3>
      <Log
        data={data?.requisicoes_recentes}
        isLoading={isLoading}
        isError={isError}
      />
    </Card>
  );
}

RequisicoesRecentes.displayName = "RequisicoesRecentes";
