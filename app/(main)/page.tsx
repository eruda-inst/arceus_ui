"use client";

import { Button, toast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import VerticalBarChart from "@/components/Charts/VerticalBar";
import OneLineChart from "@/components/Charts/OneLine";
import DualMetricCard from "@/components/DualMetricCard/DualMetricCard";
import { MetricService } from "@/services/Metric";
import {
  TodayAlwaysOut,
  TopEndpoint,
  TopHour,
  TopHourFormatted,
  TopMonthDay,
  TopStatusCode,
  TopWeekday,
  TopWorstEndpoint,
} from "@/types/metric.type";

const fetchAllMetrics = async () => {
  const {
    getTopWeekdays,
    getTopEndpoints,
    getTopHours,
    getTopStatusCodes,
    getTopWorstEndpoints,
    getAvgResTime,
    getErrorRate,
    getSuccessRate,
    getTotalErrors,
    getTotalReqs,
    getTotalServices,
    getTotalSuccesses,
    getTopMonthDays,
  } = MetricService;

  const [
    topWeekdaysRaw,
    topEndpointsRaw,
    topHoursRaw,
    topStatusCodesRaw,
    topWorstEndpointsRaw,
    avgResTimeRaw,
    errorRateRaw,
    successRateRaw,
    totalErrorsRaw,
    totalReqsRaw,
    totalServicesRaw,
    totalSuccessesRaw,
    topMonthDaysRaw,
  ] = await Promise.all([
    getTopWeekdays() as Promise<TodayAlwaysOut<TopWeekday[]>>,
    getTopEndpoints() as Promise<TodayAlwaysOut<TopEndpoint[]>>,
    getTopHours() as Promise<TodayAlwaysOut<TopHour[]>>,
    getTopStatusCodes() as Promise<TodayAlwaysOut<TopStatusCode[]>>,
    getTopWorstEndpoints() as Promise<TodayAlwaysOut<TopWorstEndpoint[]>>,
    getAvgResTime() as Promise<TodayAlwaysOut<number>>,
    getErrorRate() as Promise<TodayAlwaysOut<number>>,
    getSuccessRate() as Promise<TodayAlwaysOut<number>>,
    getTotalErrors() as Promise<TodayAlwaysOut<number>>,
    getTotalReqs() as Promise<TodayAlwaysOut<number>>,
    getTotalServices() as Promise<TodayAlwaysOut<number>>,
    getTotalSuccesses() as Promise<TodayAlwaysOut<number>>,
    getTopMonthDays() as Promise<TodayAlwaysOut<TopMonthDay[]>>,
  ]);

  const topHoursFormatted: TodayAlwaysOut<TopHourFormatted[]> = {
    hoje:
      topHoursRaw.hoje
        ?.slice()
        .sort((a, b) => a.hora - b.hora)
        .map((item) => ({
          ...item,
          hora: `${item.hora} h`,
        })) ?? [],
    sempre:
      topHoursRaw.sempre
        ?.slice()
        .sort((a, b) => a.hora - b.hora)
        .map((item) => ({
          ...item,
          hora: `${item.hora} h`,
        })) ?? [],
  };

  const topMonthDaysFormatted: TodayAlwaysOut<TopMonthDay[]> = {
    hoje:
      topMonthDaysRaw.hoje?.slice().sort((a, b) => a.dia_mes - b.dia_mes) ?? [],
    sempre:
      topMonthDaysRaw.sempre?.slice().sort((a, b) => a.dia_mes - b.dia_mes) ??
      [],
  };

  return {
    topWeekdays: topWeekdaysRaw,
    topEndpoints: topEndpointsRaw,
    topHours: topHoursFormatted,
    topStatusCodes: topStatusCodesRaw,
    topWorstEndpoints: topWorstEndpointsRaw,
    avgResTime: avgResTimeRaw,
    errorRate: errorRateRaw,
    successRate: successRateRaw,
    totalErrors: totalErrorsRaw,
    totalReqs: totalReqsRaw,
    totalServices: totalServicesRaw,
    totalSuccesses: totalSuccessesRaw,
    topMonthDays: topMonthDaysFormatted,
  };
};

function Home() {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchAllMetrics,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.danger("Erro ao carregar métricas");
    console.error(error);
  }

  const handleRefreshMetrics = async () => {
    await refetch();
    toast.success("Métricas atualizadas!");
  };

  const {
    topWeekdays = {} as TodayAlwaysOut<TopWeekday[]>,
    topEndpoints = {} as TodayAlwaysOut<TopEndpoint[]>,
    topHours = {} as TodayAlwaysOut<TopHourFormatted[]>,
    topStatusCodes = {} as TodayAlwaysOut<TopStatusCode[]>,
    topWorstEndpoints = {} as TodayAlwaysOut<TopWorstEndpoint[]>,
    avgResTime = {} as TodayAlwaysOut<number>,
    errorRate = {} as TodayAlwaysOut<number>,
    successRate = {} as TodayAlwaysOut<number>,
    totalErrors = {} as TodayAlwaysOut<number>,
    totalReqs = {} as TodayAlwaysOut<number>,
    totalServices = {} as TodayAlwaysOut<number>,
    totalSuccesses = {} as TodayAlwaysOut<number>,
    topMonthDays = {} as TodayAlwaysOut<TopMonthDay[]>,
  } = data ?? {};

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Métricas
          </h1>
          <p className="text-muted">Visualize métricas importantes</p>
        </div>
        <Button
          className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
          onPress={handleRefreshMetrics}
          size="md"
          isPending={isRefetching}
          isDisabled={isLoading || isRefetching}
        >
          {isRefetching ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <DualMetricCard
          title="Erros"
          description="Total de requisições mal-sucedidas"
          metric1Label="Taxa"
          metric1Value={errorRate}
          metric2Label="Total"
          metric2Value={totalErrors}
          formatMetric1={(v) => {
            v = v < 1 ? v * 100 : 100;
            return `${v.toFixed(2).replace(".", ",")}%`;
          }}
          isLoading={isLoading}
        />
        <DualMetricCard
          title="Sucessos"
          description="Total de requisições bem-sucedidas"
          metric1Label="Taxa"
          metric1Value={successRate}
          metric2Label="Total"
          metric2Value={totalSuccesses}
          formatMetric1={(v) => {
            v = v < 1 ? v * 100 : 100;
            return `${v.toFixed(2).replace(".", ",")}%`;
          }}
          isLoading={isLoading}
        />
        <DualMetricCard
          title="Tempo Médio de Resposta"
          description="Tempo médio de resposta entre requisições e respostas"
          metric1Label="Segundos"
          metric1Value={avgResTime}
          isLoading={isLoading}
          formatMetric1={(v) => `${v.toFixed(3).replace(".", ",")}`}
        />
        <DualMetricCard
          title="Requisições"
          description="Total de requisições realizadas"
          metric1Label="Total"
          metric1Value={totalReqs}
          isLoading={isLoading}
        />
        <DualMetricCard
          title="Atendimentos"
          description="Total de atendimentos realizados"
          metric1Label="Total"
          metric1Value={totalServices}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <VerticalBarChart
          data={topEndpoints?.hoje}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Endpoints — Hoje"
          isLoading={isLoading}
          hideXAxis
        />
        <VerticalBarChart
          data={topEndpoints?.sempre}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Endpoints — Sempre"
          isLoading={isLoading}
          hideXAxis
        />

        <VerticalBarChart
          data={topStatusCodes?.hoje}
          dataKey="status_code"
          barDataKey="total_respostas"
          name="Total de respostas"
          label="Top Status Codes — Hoje"
          isLoading={isLoading}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="vertical"
        />
        <VerticalBarChart
          data={topStatusCodes?.sempre}
          dataKey="status_code"
          barDataKey="total_respostas"
          name="Total de respostas"
          label="Top Status Codes — Sempre"
          isLoading={isLoading}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="vertical"
        />

        <OneLineChart
          data={topHours?.hoje}
          dataKey="hora"
          lineDataKey="total_requisicoes"
          name="Total de requisições"
          label="Horas de Pico — Hoje"
          isLoading={isLoading}
          lineColor="#8b5cf6"
          activeDotColor="#74a309"
        />
        <OneLineChart
          data={topHours?.sempre}
          dataKey="hora"
          lineDataKey="total_requisicoes"
          name="Total de requisições"
          label="Horas de Pico — Sempre"
          isLoading={isLoading}
          lineColor="#8b5cf6"
          activeDotColor="#74a309"
        />

        <VerticalBarChart
          data={topWeekdays?.hoje}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Dias da Semana"
          isLoading={isLoading}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="vertical"
        />
        <VerticalBarChart
          data={topWeekdays?.sempre}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Dias da Semana — Sempre"
          isLoading={isLoading}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="vertical"
        />

        <VerticalBarChart
          data={topMonthDays?.hoje}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Dias do Mês"
          isLoading={isLoading}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
          layout="vertical"
        />
        <VerticalBarChart
          data={topMonthDays?.sempre}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          label="Top Dias do Mês — Sempre"
          isLoading={isLoading}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
          layout="vertical"
        />

        <VerticalBarChart
          data={topWorstEndpoints?.hoje}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          label="Piores Endpoints — Hoje"
          isLoading={isLoading}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />
        <VerticalBarChart
          data={topWorstEndpoints?.sempre}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          label="Piores Endpoints — Sempre"
          isLoading={isLoading}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />
      </div>
    </>
  );
}

export default Home;
