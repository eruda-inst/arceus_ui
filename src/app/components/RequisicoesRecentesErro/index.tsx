import { Log } from "@/app/components/Log";
import { Mensagem } from "@/app/components/Mensagem";
import { Card } from "@/app/components/Card";
import { API_CONFIG } from "@/utils/config";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Log as LogType } from "@/utils/type/log";

interface RequisicoesRecentesErroOut {
  requisicoes_recentes_erro: LogType[];
}

export function RequisicoesRecentesErro() {
  const { data, isError, isLoading } =
    useReactWebSocket<RequisicoesRecentesErroOut>(
      API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES_ERRO
    );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Últimas Requisições com Erro
      </h3>
      <Log
        data={data?.requisicoes_recentes_erro}
        isLoading={isLoading}
        isError={isError}
      />
    </Card>
  );
}

RequisicoesRecentesErro.displayName = "RequisicoesRecentesErro";
