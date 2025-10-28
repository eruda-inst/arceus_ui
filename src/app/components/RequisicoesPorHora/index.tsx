import { Card } from "@/app/components/Card";
import { Mensagem } from "@/app/components/Mensagem";
import { LineChartComponent } from "@/app/components/LineChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/utils/config";

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
    API_CONFIG.WS_ENDPOINTS.REQUISICOES_POR_HORA
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
        hora: `${String(i).padStart(2, "0")}:00`,
        total: 0,
      })
    );

    data.forEach((item) => {
      const itemHour = parseInt(String(item.hora).split(":")[0], 10);
      if (itemHour <= currentHour) {
        const index = fullDayData.findIndex(
          (d) => d.hora === `${String(itemHour).padStart(2, "0")}:00`
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
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Requisições por Hora
      </h3>
      {reqPorHoraIsLoading ? (
        <Mensagem>Caregando...</Mensagem>
      ) : reqPorHoraIsError ? (
        <Mensagem className="text-red-500">Erro</Mensagem>
      ) : (
        <LineChartComponent
          data={filterAndProcessHourlyRequests(
            reqPorHoraData?.requisicoes_por_hora
          )}
          xKey="hora"
          yKey="total"
          lineName="Número de Requisições"
          showDots={true}
        />
      )}
    </Card>
  );
}

RequisicoesPorHora.displayName = "RequisicoesPorHora";
