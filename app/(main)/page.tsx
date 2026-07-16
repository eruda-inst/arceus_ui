"use client";

import { Button, toast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import CustomBar from "@/components/Charts/CustomBar";
import OneLineChart from "@/components/Charts/OneLine";
import { MetricCard } from "@/components/MetricCard/MetricCard";
import { MetricService } from "@/services/Metric";
import {
  TodayAlwaysOut,
  TopEndpoint,
  TopHourFormatted,
  TopMonthDay,
  TopStatusCode,
  TopWeekday,
  TopWorstEndpoint,
  TopSlowestEndpoint,
  TopHttpMethod,
  TopDepartment,
  SuccessStats,
  ErrorStats,
} from "@/types/metric.type";

const fetchAllMetrics = async () => {
  const {
    getTopWeekdays,
    getTopEndpoints,
    getTopHours,
    getTopStatusCodes,
    getTopWorstEndpoints,
    getResTime,
    getTotalReqs,
    getTotalServices,
    getTopMonthDays,
    getTopSlowestEndpoints,
    getTopHttpMethods,
    getTopDepartments,
    getSuccessStats,
    getErrorStats,
  } = MetricService;

  const [
    topWeekdaysRaw,
    topEndpointsRaw,
    topHoursRaw,
    topStatusCodesRaw,
    topWorstEndpointsRaw,
    resTimeRaw,
    totalReqsRaw,
    totalServicesRaw,
    topMonthDaysRaw,
    topSlowestEndpointsRaw,
    topHttpMethodsRaw,
    topDepartmentsRaw,
    successStatsRaw,
    errorStatsRaw,
  ] = await Promise.all([
    getTopWeekdays(),
    getTopEndpoints(),
    getTopHours(),
    getTopStatusCodes(),
    getTopWorstEndpoints(),
    getResTime(),
    getTotalReqs(),
    getTotalServices(),
    getTopMonthDays(),
    getTopSlowestEndpoints(),
    getTopHttpMethods(),
    getTopDepartments(),
    getSuccessStats(),
    getErrorStats(),
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
    resTime: resTimeRaw,
    totalReqs: totalReqsRaw,
    totalServices: totalServicesRaw,
    topMonthDays: topMonthDaysFormatted,
    topSlowestEndpoints: topSlowestEndpointsRaw,
    topHttpMethods: topHttpMethodsRaw,
    topDepartments: topDepartmentsRaw,
    successStats: successStatsRaw,
    errorStats: errorStatsRaw,
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
    resTime = {} as TodayAlwaysOut<{ min: number; avg: number; max: number }>,
    totalReqs = {} as TodayAlwaysOut<number>,
    totalServices = {} as TodayAlwaysOut<number>,
    topMonthDays = {} as TodayAlwaysOut<TopMonthDay[]>,
    topSlowestEndpoints = {} as TodayAlwaysOut<TopSlowestEndpoint[]>,
    topHttpMethods = {} as TodayAlwaysOut<TopHttpMethod[]>,
    topDepartments = {} as TodayAlwaysOut<TopDepartment[]>,
    successStats = {} as TodayAlwaysOut<SuccessStats>,
    errorStats = {} as TodayAlwaysOut<ErrorStats>,
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
        {/* Erros */}
        <MetricCard
          title="Malsucedidas"
          description="Total de requisições malsucedidas"
          metrics={[
            {
              label: "Taxa",
              value: {
                hoje: errorStats?.hoje?.percentual ?? 0,
                sempre: errorStats?.sempre?.percentual ?? 0,
              },
              format: (v: Number) => `${v.toFixed(2).replace(".", ",")}%`,
            },
            {
              label: "Total",
              value: {
                hoje: errorStats?.hoje?.total ?? 0,
                sempre: errorStats?.sempre?.total ?? 0,
              },
            },
          ]}
          isLoading={isLoading}
        />

        {/* Sucessos */}
        <MetricCard
          title="Bem-sucedidas"
          description="Total de requisições bem-sucedidas"
          metrics={[
            {
              label: "Taxa",
              value: {
                hoje: successStats?.hoje?.percentual ?? 0,
                sempre: successStats?.sempre?.percentual ?? 0,
              },
              format: (v: Number) => `${v.toFixed(2).replace(".", ",")}%`,
            },
            {
              label: "Total",
              value: {
                hoje: successStats?.hoje?.total ?? 0,
                sempre: successStats?.sempre?.total ?? 0,
              },
            },
          ]}
          isLoading={isLoading}
        />

        {/* Tempo de Resposta (agora com 3 métricas) */}
        <MetricCard
          title="Tempo de Resposta"
          description="Mínimo, média e máximo (em segundos)"
          metrics={[
            {
              label: "Mín",
              value: {
                hoje: resTime?.hoje?.min ?? 0,
                sempre: resTime?.sempre?.min ?? 0,
              },
              format: (v: Number) => v.toFixed(3).replace(".", ","),
            },
            {
              label: "Méd",
              value: {
                hoje: resTime?.hoje?.avg ?? 0,
                sempre: resTime?.sempre?.avg ?? 0,
              },
              format: (v: Number) => v.toFixed(3).replace(".", ","),
            },
            {
              label: "Máx",
              value: {
                hoje: resTime?.hoje?.max ?? 0,
                sempre: resTime?.sempre?.max ?? 0,
              },
              format: (v: Number) => v.toFixed(3).replace(".", ","),
            },
          ]}
          isLoading={isLoading}
        />

        {/* Requisições (apenas Total) */}
        <MetricCard
          title="Requisições"
          description="Total de requisições realizadas"
          metrics={[
            {
              label: "Total",
              value: {
                hoje: totalReqs?.hoje ?? 0,
                sempre: totalReqs?.sempre ?? 0,
              },
            },
          ]}
          isLoading={isLoading}
        />

        {/* Atendimentos (apenas Total) */}
        <MetricCard
          title="Atendimentos"
          description="Total de atendimentos realizados"
          metrics={[
            {
              label: "Total",
              value: {
                hoje: totalServices?.hoje ?? 0,
                sempre: totalServices?.sempre ?? 0,
              },
            },
          ]}
          isLoading={isLoading}
        />
      </div>

      {/* Top endpoints */}
      <div className="grid grid-cols-2 gap-4">
        <CustomBar
          data={topEndpoints?.hoje}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Endpoints mais acessados no período"
          label="Top Endpoints — Hoje"
          isLoading={isLoading}
          hideXAxis
        />
        <CustomBar
          data={topEndpoints?.sempre}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Endpoints mais acessados no período"
          label="Top Endpoints — Sempre"
          isLoading={isLoading}
          hideXAxis
        />

        {/* Top status codes */}
        <CustomBar
          data={topStatusCodes?.hoje}
          dataKey="status_code"
          barDataKey="total_respostas"
          description="Códigos de status mais frequentes"
          name="Total de respostas"
          label="Top Status Codes — Hoje"
          isLoading={isLoading}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="horizontal"
        />
        <CustomBar
          data={topStatusCodes?.sempre}
          dataKey="status_code"
          barDataKey="total_respostas"
          name="Total de respostas"
          description="Códigos de status mais frequentes"
          label="Top Status Codes — Sempre"
          isLoading={isLoading}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="horizontal"
        />

        {/* Top métodos HTTP */}
        <CustomBar
          data={topHttpMethods?.hoje}
          dataKey="metodo_http"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Métodos HTTP mais utilizados"
          label="Top Métodos HTTP — Hoje"
          isLoading={isLoading}
          barColor="#06b6d4"
          activeBarColor="#ec4899"
          layout="horizontal"
        />
        <CustomBar
          data={topHttpMethods?.sempre}
          dataKey="metodo_http"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Métodos HTTP mais utilizados"
          label="Top Métodos HTTP — Sempre"
          isLoading={isLoading}
          barColor="#06b6d4"
          activeBarColor="#ec4899"
          layout="horizontal"
        />

        {/* Top setores */}
        <CustomBar
          data={topDepartments?.hoje}
          dataKey="setor"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Setores com maior volume de requisições"
          label="Top Setores — Hoje"
          isLoading={isLoading}
          barColor="#3b82f6"
          activeBarColor="#34d399"
          layout="horizontal"
        />
        <CustomBar
          data={topDepartments?.sempre}
          dataKey="setor"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Setores com maior volume de requisições"
          label="Top Setores — Sempre"
          isLoading={isLoading}
          barColor="#3b82f6"
          activeBarColor="#34d399"
          layout="horizontal"
        />

        {/* Horas de pico */}
        <OneLineChart
          data={topHours?.hoje}
          dataKey="hora"
          lineDataKey="total_requisicoes"
          name="Total de requisições"
          description="Distribuição de requisições por hora do dia"
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
          description="Distribuição de requisições por hora do dia"
          label="Horas de Pico — Sempre"
          isLoading={isLoading}
          lineColor="#8b5cf6"
          activeDotColor="#74a309"
        />

        {/* Top dias da semana */}
        <CustomBar
          data={topWeekdays?.hoje}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias com maior concentração de acessos"
          label="Top Dias da Semana"
          isLoading={isLoading}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="horizontal"
        />
        <CustomBar
          data={topWeekdays?.sempre}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias com maior concentração de acessos"
          label="Top Dias da Semana — Sempre"
          isLoading={isLoading}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="horizontal"
        />

        {/* Top dias do mês */}
        <CustomBar
          data={topMonthDays?.hoje}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias do mês com mais requisições"
          label="Top Dias do Mês"
          isLoading={isLoading}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
        />
        <CustomBar
          data={topMonthDays?.sempre}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias do mês com mais requisições"
          label="Top Dias do Mês — Sempre"
          isLoading={isLoading}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
        />

        {/* Top piores endpoints */}
        <CustomBar
          data={topWorstEndpoints?.hoje}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          description="Endpoints com maior número de erros"
          label="Piores Endpoints — Hoje"
          isLoading={isLoading}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />
        <CustomBar
          data={topWorstEndpoints?.sempre}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          description="Endpoints com maior número de erros"
          label="Piores Endpoints — Sempre"
          isLoading={isLoading}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />

        {/* Top endpoints mais lentos */}
        <CustomBar
          data={topSlowestEndpoints?.hoje}
          dataKey="endpoint"
          name="Tempo médio de resposta"
          barDataKey="duracao"
          description="Endpoints com maior tempo médio de resposta"
          label="Endpoints mais Lentos — Hoje"
          isLoading={isLoading}
          hideXAxis
          barColor="#6c5ce7"
          activeBarColor="#fdcb6e"
        />
        <CustomBar
          data={topSlowestEndpoints?.sempre}
          dataKey="endpoint"
          name="Tempo médio de resposta"
          barDataKey="duracao"
          description="Endpoints com maior tempo médio de resposta"
          label="Endpoints mais Lentos — Sempre"
          isLoading={isLoading}
          hideXAxis
          barColor="#6c5ce7"
          activeBarColor="#fdcb6e"
        />
      </div>
    </>
  );
}

export default Home;
