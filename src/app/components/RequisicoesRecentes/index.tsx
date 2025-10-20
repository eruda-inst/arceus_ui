import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchDados } from "@/utils/helpers/fetch";
import { Card } from "@/app/components/Card";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { API_CONFIG } from "@/utils/config";
import { converterTempo } from "@/utils/helpers/converter";

interface RequisicoesRecentesLog {
  ip: string;
  http_method: number;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

export function RequisicoesRecentes() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["requisicoes_recentes"],
    queryFn: async function () {
      const params = {
        limit: 5,
      };
      return await fetchDados(
        API_CONFIG.ENDPOINTS.REQUISICOES_RECENTES,
        params
      );
    },
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold">Log de Requisições Recentes</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <th className="py-2">IP</th>
              <th className="py-2">Verbo</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Status</th>
              <th className="py-2">Data</th>
              <th className="py-2">Hora</th>
              <th className="py-2">Duração</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <FetchingLoadingMensagem />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6}>
                  <FetchingMensagemErro />
                </td>
              </tr>
            ) : (
              data?.requisicoes_recentes?.map((log: RequisicoesRecentesLog) => (
                <tr
                  key={uuidv4()}
                  className="text-sm border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
                >
                  <td className="py-2">{log.ip}</td>
                  <td className="py-2">{log.http_method}</td>
                  <td className="py-2">{log.endpoint}</td>
                  <td className="py-2">{log.status_code}</td>
                  <td className="py-2">{log.data}</td>
                  <td className="py-2">{log.hora.slice(0, 5)}</td>
                  <td className="py-2">{converterTempo(log.duracao)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

RequisicoesRecentes.displayName = "RequisicoesRecentes";
