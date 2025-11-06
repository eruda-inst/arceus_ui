import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";

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
      <CardHeader>
        <CardTitle>Distribuição de Status Codes (todo o período)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Mensagem>Carregando...</Mensagem>
        ) : isError ? (
          <Mensagem className="text-destructive">Erro</Mensagem>
        ) : distribuicaoTransformada.length === 0 ? (
          <Mensagem className="text-destructive">N/A</Mensagem>
        ) : (
          <BarChartComponent
            data={distribuicaoTransformada}
            xKey="statusCode"
            yKey="total"
            barName="Número de Ocorrências"
          />
        )}
      </CardContent>
    </Card>
  );
}

DistribuicaoStatusCode.displayName = "DistribuicaoStatusCode";
