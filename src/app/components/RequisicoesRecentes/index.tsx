import { v4 as uuidv4 } from "uuid";
import { Card } from "@/app/components/Card";
import { Mensagem } from "@/app/components/Mensagem";
import { Pill } from "@/app/components/Pill";
import { API_CONFIG } from "@/utils/config";
import { formatarData } from "@/utils/helpers/formatar";
import { converterTempo } from "@/utils/helpers/converter";
import { obterCorMetodo, obterCorStatusCode } from "@/utils/helpers/obterCor";
import { useWebSocket } from "@/hooks/useWebSocket";

interface RequisicoesRecentesLog {
  ip: string;
  http_method: number;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

interface RequisicoesRecentesOut {
  requisicoes_recentes: RequisicoesRecentesLog[];
}

export function RequisicoesRecentes() {
  const { data, isError, isLoading } = useWebSocket<RequisicoesRecentesOut>(
    API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold">Log de Requisições Recentes</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-border-light dark:border-border-dark">
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
                  <Mensagem>Caregando...</Mensagem>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6}>
                  <Mensagem className="text-red-500">Erro</Mensagem>
                </td>
              </tr>
            ) : (
              data?.requisicoes_recentes?.map((log: RequisicoesRecentesLog) => (
                <tr
                  key={uuidv4()}
                  className="text-sm border-b border-border-light dark:border-border-dark"
                >
                  <td className="py-2">{log.ip}</td>
                  <td className="py-2">
                    <Pill className={obterCorMetodo(log.http_method)}>
                      {log.http_method}
                    </Pill>
                  </td>
                  <td className="py-2">{log.endpoint}</td>
                  <td className="py-2">
                    <Pill className={obterCorStatusCode(log.status_code)}>
                      {log.status_code}
                    </Pill>
                  </td>
                  <td className="py-2">{formatarData(log.data)}</td>
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
