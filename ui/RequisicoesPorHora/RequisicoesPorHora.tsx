import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { LineChartComponent } from "@/ui/LineChartComponent/LineChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";
import { Spinner } from "@/components/ui/spinner";

interface RequisicaoPorHora {
  hora: string;
  total: number;
}

interface RequisicoesPorHoraOut {
  requisicoes_por_hora: RequisicaoPorHora[];
}

export function RequisicoesPorHora() {
  const {
    data: reqPorHoraData,
    isLoading: reqPorHoraIsLoading,
    isError: reqPorHoraIsError,
  } = useReactWebSocket<RequisicoesPorHoraOut>(
    API_CONFIG.WS.ROTAS.REQUISICOES_POR_HORA
  );

  function filterAndProcessHourlyRequests(
    data: RequisicaoPorHora[] | undefined
  ) {
    if (!data) return [];

    const now = new Date();
    const currentHour = now.getHours();
    const fullDayData: RequisicaoPorHora[] = Array.from(
      { length: currentHour + 1 },
      (_, i) => ({
        hora: `${String(i)}h`,
        total: 0,
      })
    );

    data.forEach((item) => {
      const itemHour = parseInt(String(item.hora).split(":")[0], 10);
      if (itemHour <= currentHour) {
        const index = fullDayData.findIndex(
          (d) => d.hora === `${String(itemHour)}h`
        );
        if (index !== -1) {
          fullDayData[index] = { ...item, hora: fullDayData[index].hora };
        }
      }
    });

    return fullDayData;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requisições por Hora (hoje)</CardTitle>
      </CardHeader>
      <CardContent>
        {reqPorHoraIsLoading ? (
          <Spinner />
        ) : reqPorHoraIsError ? (
          <Mensagem className="text-destructive">Erro</Mensagem>
        ) : (
          <LineChartComponent
            data={filterAndProcessHourlyRequests(
              reqPorHoraData?.requisicoes_por_hora
            )}
            xKey="hora"
            yKey="total"
            showDots={true}
          />
        )}
      </CardContent>
    </Card>
  );
}

RequisicoesPorHora.displayName = "RequisicoesPorHora";
