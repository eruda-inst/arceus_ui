import { Card } from "@/app/components/Card";
import { Mensagem } from "@/app/components/Mensagem";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/utils/config";

interface DistribuicaoStatusCodeData {
  [key: string]: number;
}

interface DistribuicaoStatusCodeOut {
  distribuicao_status_code: DistribuicaoStatusCodeData;
}

interface DistribuicaoStatusCodeTransformed {
  statusCode: string;
  total: number;
}

export function DistribuicaoStatusCode() {
  const { data, isLoading, isError } =
    useReactWebSocket<DistribuicaoStatusCodeOut>(
      API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_STATUS_CODE
    );

  function transformDistribuicaoStatusCode(
    data: DistribuicaoStatusCodeOut | null | undefined
  ): DistribuicaoStatusCodeTransformed[] {
    if (!data || !data.distribuicao_status_code) {
      return [];
    }

    const statusCodesMap = data.distribuicao_status_code;
    const transformedData: DistribuicaoStatusCodeTransformed[] = [];

    Object.keys(statusCodesMap).forEach((key) => {
      const total = statusCodesMap[key];

      const statusCodeMatch = key.match(/status_(\d+)/);
      if (statusCodeMatch && total > 0) {
        transformedData.push({
          statusCode: statusCodeMatch[1],
          total: total,
        });
      }
    });

    transformedData.sort(
      (a, b) => parseInt(a.statusCode) - parseInt(b.statusCode)
    );

    return transformedData;
  }

  const distribuicaoTransformada = transformDistribuicaoStatusCode(data);
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Distribuição de Status Codes
      </h3>
      {isLoading ? (
        <Mensagem>Carregando...</Mensagem>
      ) : isError ? (
        <Mensagem className="text-red-500">Erro</Mensagem>
      ) : distribuicaoTransformada.length === 0 ? (
        "N/A"
      ) : (
        <BarChartComponent
          data={distribuicaoTransformada}
          xKey="statusCode"
          yKey="total"
          barName="Número de Ocorrências"
        />
      )}
    </Card>
  );
}

DistribuicaoStatusCode.displayName = "DistribuicaoStatusCode";
