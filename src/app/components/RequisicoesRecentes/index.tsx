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

  if (isLoading) {
    return <Mensagem>Carregando...</Mensagem>;
  }

  if (isError) {
    return <Mensagem className="text-red-500">Erro</Mensagem>;
  }

  if (!data) {
    return <Mensagem className="text-red-500">Nenhum log</Mensagem>;
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Requisições Recentes
      </h3>
      <Log data={data?.requisicoes_recentes} />
    </Card>
  );
}

RequisicoesRecentes.displayName = "RequisicoesRecentes";
