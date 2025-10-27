import { v4 as uuidv4 } from "uuid";
import { Mensagem } from "@/app/components/Mensagem";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";
import { obterCorMetodo } from "@/utils/helpers/obterCor";
import { API_CONFIG } from "@/utils/config";
import { useWebSocket } from "@/hooks/useWebSocket";

interface TopEndpointsLog {
  http_method: number;
  endpoint: string;
  total_acessos: number;
}

interface TopEndpointsLogOut {
  top_endpoints: TopEndpointsLog[];
}

export function TopEndpoints() {
  const { data, isLoading, isError } = useWebSocket<TopEndpointsLogOut>(
    API_CONFIG.WS_ENDPOINTS.TOP_ENDPOINTS
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold">Endpoints Mais Acessados</h3>
      <div className="mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-(--border-light) dark:border-(--border-dark)">
              <th className="py-2">Verbo</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3}>
                  <Mensagem>Caregando...</Mensagem>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={3}>
                  <Mensagem className="text-red-500">Erro</Mensagem>
                </td>
              </tr>
            ) : (
              data?.top_endpoints?.map((log: TopEndpointsLog) => (
                <tr
                  key={uuidv4()}
                  className="text-sm border-b border-border-light dark:border-border-dark"
                >
                  <td className="py-2">
                    <Pill className={obterCorMetodo(log.http_method)}>
                      {log.http_method}
                    </Pill>
                  </td>
                  <td className="py-2">{log.endpoint}</td>
                  <td className="py-2">{log.total_acessos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

TopEndpoints.displayName = "TopEndpoints";
