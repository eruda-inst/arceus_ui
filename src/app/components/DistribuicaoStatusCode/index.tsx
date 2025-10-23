import { Card } from "@/app/components/Card";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MensagemErro } from "@/app/components/MensagemErro";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { useWebSocket } from "@/hooks/useWebSocket";
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
  const { data, isLoading, isError } = useWebSocket<DistribuicaoStatusCodeOut>(
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
      <h3 className="text-left w-full">Distribuição de Status Codes</h3>
      {isLoading ? (
        <FetchingLoadingMensagem />
      ) : isError ? (
        <FetchingMensagemErro />
      ) : distribuicaoTransformada.length === 0 ? (
        <MensagemErro>Sem dados</MensagemErro>
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
