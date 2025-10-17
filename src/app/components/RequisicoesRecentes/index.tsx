import { v4 as uuidv4 } from "uuid";
import { Card } from "@/app/components/Card";
import { useQuery } from "@tanstack/react-query";
import { fetchDados } from "@/utils/helpers/fetch";
import { API_CONFIG } from "@/utils/config";

interface RequisicoesRecentesLog {
  ip: string;
  http_method: number;
  endpoint: string;
  status_code: number;
  datetime: string;
  duracao: number;
}

export function RequisicoesRecentes() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["requisicoes_recentes"],
    queryFn: async function () {
      return await fetchDados(API_CONFIG.ENDPOINTS.REQUISICOES_RECENTES);
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
              <th className="py-2">Data/Hora</th>
              <th className="py-2">Duração</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Carregando...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <p className="text-red-500">Erro ao carregar os dados.</p>
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
                  <td className="py-2">{log.datetime}</td>
                  <td className="py-2">{Math.round(log.duracao)} ms</td>
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
