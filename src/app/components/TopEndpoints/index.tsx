import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchDados } from "@/utils/helpers/fetch";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { Card } from "@/app/components/Card";
import { API_CONFIG } from "@/utils/config";

interface TopEndpointsLog {
  http_method: number;
  endpoint: string;
  total_acessos: number;
}

export function TopEndpoints() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["top_endpoints"],
    queryFn: async function () {
      const params = {
        limit: 5,
      };
      return await fetchDados(API_CONFIG.ENDPOINTS.TOP_ENDPOINTS, params);
    },
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold">Endpoints Mais Acessados</h3>
      <div className="mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <th className="py-2">Verbo</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3}>
                  <FetchingLoadingMensagem />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={3}>
                  <FetchingMensagemErro />
                </td>
              </tr>
            ) : (
              data?.top_endpoints?.map((log: TopEndpointsLog) => (
                <tr
                  key={uuidv4()}
                  className="text-sm border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
                >
                  <td className="py-2">{log.http_method}</td>
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
