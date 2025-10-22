import { v4 as uuidv4 } from "uuid";
import { Card } from "@/app/components/Card";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { API_CONFIG } from "@/utils/config";
import { converterTempo } from "@/utils/helpers/converter";
import { useWebSocket } from "@/hooks/useWebSocket";

interface RequisicoesRecentesErroLog {
  status_code: number;
  endpoint: string;
  duracao: number;
}

interface RequisicoesRecentesErroOut {
  requisicoes_recentes_erro: RequisicoesRecentesErroLog[];
}

export function RequisicoesRecentesErro() {
  const {
    data: wsData,
    isError: wsIsError,
    isLoading: wsIsLoading,
  } = useWebSocket<RequisicoesRecentesErroOut>(
    API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES_ERRO
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold">Últimas Requisições com Erro</h3>
      <div className="mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <th className="py-2">Status</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Duração</th>
            </tr>
          </thead>
          <tbody>
            {wsIsLoading ? (
              <tr>
                <td colSpan={3}>
                  <FetchingLoadingMensagem />
                </td>
              </tr>
            ) : wsIsError ? (
              <tr>
                <td colSpan={3}>
                  <FetchingMensagemErro />
                </td>
              </tr>
            ) : (
              wsData?.requisicoes_recentes_erro?.map(
                (log: RequisicoesRecentesErroLog) => (
                  <tr
                    key={uuidv4()}
                    className="text-sm border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
                  >
                    <td className="py-2">{log.status_code}</td>
                    <td className="py-2">{log.endpoint}</td>
                    <td className="py-2">{converterTempo(log.duracao)}</td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

RequisicoesRecentesErro.displayName = "RequisicoesRecentesErro";
