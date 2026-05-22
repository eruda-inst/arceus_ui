"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, toast } from "@heroui/react";
import VerticalBarChart from "@/components/Charts/VerticalBar";
import OneLineChart from "@/components/Charts/OneLine";
import DualMetricCard from "@/components/DualMetricCard/DualMetricCard";
import { MetricService } from "@/services/Metric";

function Home() {
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

  const [topWeekdays, setTopWeekdays] = useState<any>({});
  const [topEndpoints, setTopEndpoints] = useState<any>({});
  const [topHours, setTopHours] = useState<any>({});
  const [topStatusCodes, setTopStatusCodes] = useState<any>({});
  const [topWorstEndpoints, setTopWorstEndpoints] = useState<any>({});
  const [avgResTime, setAvgResTime] = useState<any>({});
  const [errorRate, setErrorRate] = useState<any>({});
  const [successRate, setSuccessRate] = useState<any>({});
  const [totalErrors, setTotalErrors] = useState<any>({});
  const [totalReqs, setTotalReqs] = useState<any>({});
  const [totalServices, setTotalServices] = useState<any>({});
  const [totalSuccesses, setTotalSuccesses] = useState<any>({});
  const [topMonthDays, setTopMonthDays] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [
        topWeekdays,
        topEndpoints,
        topHoursRaw,
        topStatusCodes,
        topWorstEndpoints,
        avgResTime,
        errorRate,
        successRate,
        totalErrors,
        totalReqs,
        totalServices,
        totalSuccesses,
        topMonthDaysRaw,
      ] = await Promise.all([
        getTopWeekdays(),
        getTopEndpoints(),
        getTopHours(),
        getTopStatusCodes(),
        getTopWorstEndpoints(),
        getAvgResTime(),
        getErrorRate(),
        getSuccessRate(),
        getTotalErrors(),
        getTotalReqs(),
        getTotalServices(),
        getTotalSuccesses(),
        getTopMonthDays(),
      ]);
      const topHours = {
        hoje: topHoursRaw?.hoje
          ?.slice()
          .sort((a: any, b: any) => a.hora - b.hora)
          .map((item: any) => ({
            ...item,
            hora: `${item.hora} h`,
          })),
        sempre: topHoursRaw?.sempre
          ?.slice()
          .sort((a: any, b: any) => a.hora - b.hora)
          .map((item: any) => ({
            ...item,
            hora: `${item.hora} h`,
          })),
      };
      const topMonthDays = {
        hoje: topMonthDaysRaw?.hoje
          ?.slice()
          .sort((a: any, b: any) => a.day - b.day),
        sempre: topMonthDaysRaw?.sempre
          ?.slice()
          .sort((a: any, b: any) => a.day - b.day),
      };
      setTopHours(topHours);
      setTopWeekdays(topWeekdays);
      setTopEndpoints(topEndpoints);
      setTopStatusCodes(topStatusCodes);
      setTopWorstEndpoints(topWorstEndpoints);
      setAvgResTime(avgResTime);
      setErrorRate(errorRate);
      setSuccessRate(successRate);
      setTotalErrors(totalErrors);
      setTotalReqs(totalReqs);
      setTotalServices(totalServices);
      setTotalSuccesses(totalSuccesses);
      setTopMonthDays(topMonthDays);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = useCallback(async () => {
    await fetchAll();
  }, []);

  const handleRefreshMetrics = async () => {
    setIsRefreshing(true);
    await fetchAll();
    setIsRefreshing(false);
    toast.success("Métricas atualizadas!");
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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
          isPending={isRefreshing}
          isDisabled={isLoading || isRefreshing}
        >
          {({ isPending }) => (isPending ? "Atualizado..." : "Atualizar")}
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
            v = v === 1 ? v * 100 : v;
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
            v = v === 1 ? v * 100 : v;
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
        {/* Top Endpoints – cores padrão (ciano e laranja) */}
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

        {/* Top Status Codes – verde */}
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

        {/* Horas de Pico – roxo/rosa */}
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

        {/* Top Dias da Semana – amarelo/laranja escuro */}
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

        {/* Top Dias do Mês – laranja queimado */}
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

        {/* Piores Endpoints – vermelho */}
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
