"use client";

import { Typography } from "@heroui/react";
import BarChartCard from "@/components/Charts/BarChartCard";
import LineChartCard from "@/components/Charts/LineChartCard";
import MetricCard from "@/components/MetricCard";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";
import useMetricWebSocket from "@/hooks/useMetricWebSocket.hook";
import { API_ROUTES } from "@/configs/api.config";

/**
 * Metrics dashboard page.
 * Displays real-time metrics via WebSocket, including error/success rates,
 * response times, request counts, and various top charts.
 */
export default function MetricsPage() {
  // WebSocket connection for metrics data; initialMetrics set to 'all' to fetch all metric types.
  const {
    isConnected,
    isConnecting,
    lastMessage: metrics,
  } = useMetricWebSocket({
    url: API_ROUTES.metricWs(),
    initialMetrics: "all",
  });

  /**
   * Process top hours data: sort by hour number and append "h" suffix for display.
   * Both "hoje" (today) and "sempre" (all time) are processed similarly.
   */
  const topHorasHoje = metrics?.top_horas?.hoje
    ? [...metrics.top_horas.hoje]
        .sort((a, b) => Number(a.hora) - Number(b.hora))
        .map((item) => ({ ...item, hora: `${item.hora}h` }))
    : [];

  const topHorasSempre = metrics?.top_horas?.sempre
    ? [...metrics.top_horas.sempre]
        .sort((a, b) => Number(a.hora) - Number(b.hora))
        .map((item) => ({ ...item, hora: `${item.hora}h` }))
    : [];

  /**
   * Process top days of month: sort by day number.
   */
  const topDiasMesHoje = metrics?.top_dias_mes?.hoje
    ? [...metrics.top_dias_mes.hoje].sort((a, b) => a.dia_mes - b.dia_mes)
    : [];

  const topDiasMesSempre = metrics?.top_dias_mes?.sempre
    ? [...metrics.top_dias_mes.sempre].sort((a, b) => a.dia_mes - b.dia_mes)
    : [];

  return (
    <>
      <div className="container mx-auto p-2 space-y-6">
        {/* Header with title, description, and WebSocket connection status */}
        <div className="flex justify-between items-center">
          <div>
            <Typography
              type="h2"
              className="bg-linear-to-r from-purple-500 to-indigo-500 w-fit text-transparent bg-clip-text"
            >
              Métricas
            </Typography>
            <p className="text-muted">Visualize métricas importantes</p>
            <p className="text-warning-soft-foreground">
              As informações são atualizadas automaticamente, não é necessário
              recarregar a página
            </p>
            <ConnectionIndicatior
              isConnected={isConnected}
              isConnecting={isConnecting}
            />
          </div>
        </div>

        {/* Metric Cards Grid: displays key performance indicators */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            title="Malsucedidas"
            description="Total de requisições malsucedidas"
            metrics={[
              {
                label: "Taxa",
                value: {
                  hoje: metrics?.erros?.hoje?.percentual ?? 0,
                  sempre: metrics?.erros?.sempre?.percentual ?? 0,
                },
                format: (v: number) => `${v.toFixed(2).replace(".", ",")}%`,
              },
              {
                label: "Total",
                value: {
                  hoje: metrics?.erros?.hoje?.total ?? 0,
                  sempre: metrics?.erros?.sempre?.total ?? 0,
                },
              },
            ]}
            isLoading={!metrics}
          />

          <MetricCard
            title="Bem-sucedidas"
            description="Total de requisições bem-sucedidas"
            metrics={[
              {
                label: "Taxa",
                value: {
                  hoje: metrics?.sucessos?.hoje?.percentual ?? 0,
                  sempre: metrics?.sucessos?.sempre?.percentual ?? 0,
                },
                format: (v: number) => `${v.toFixed(2).replace(".", ",")}%`,
              },
              {
                label: "Total",
                value: {
                  hoje: metrics?.sucessos?.hoje?.total ?? 0,
                  sempre: metrics?.sucessos?.sempre?.total ?? 0,
                },
              },
            ]}
            isLoading={!metrics}
          />

          <MetricCard
            title="Tempo de Resposta"
            description="Mínimo, média e máximo (em segundos)"
            metrics={[
              {
                label: "Mín",
                value: {
                  hoje: metrics?.tempo_resposta?.hoje?.min ?? 0,
                  sempre: metrics?.tempo_resposta?.sempre?.min ?? 0,
                },
                format: (v: number) => v.toFixed(3).replace(".", ","),
              },
              {
                label: "Méd",
                value: {
                  hoje: metrics?.tempo_resposta?.hoje?.avg ?? 0,
                  sempre: metrics?.tempo_resposta?.sempre?.avg ?? 0,
                },
                format: (v: number) => v.toFixed(3).replace(".", ","),
              },
              {
                label: "Máx",
                value: {
                  hoje: metrics?.tempo_resposta?.hoje?.max ?? 0,
                  sempre: metrics?.tempo_resposta?.sempre?.max ?? 0,
                },
                format: (v: number) => v.toFixed(3).replace(".", ","),
              },
            ]}
            isLoading={!metrics}
          />

          <MetricCard
            title="Requisições"
            description="Total de requisições realizadas"
            metrics={[
              {
                label: "Total",
                value: {
                  hoje: metrics?.total_requisicoes?.hoje ?? 0,
                  sempre: metrics?.total_requisicoes?.sempre ?? 0,
                },
              },
            ]}
            isLoading={!metrics}
          />

          <MetricCard
            title="Atendimentos"
            description="Total de atendimentos realizados"
            metrics={[
              {
                label: "Total",
                value: {
                  hoje: metrics?.total_atendimentos?.hoje ?? 0,
                  sempre: metrics?.total_atendimentos?.sempre ?? 0,
                },
              },
            ]}
            isLoading={!metrics}
          />
        </div>

        {/* Charts Grid: each pair shows today vs all-time data */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Endpoints */}
          <BarChartCard
            data={metrics?.top_endpoints?.hoje}
            dataKey="endpoint"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Endpoints mais acessados no período"
            label="Top Endpoints — Hoje"
            isLoading={!metrics}
            hideXAxis
          />
          <BarChartCard
            data={metrics?.top_endpoints?.sempre}
            dataKey="endpoint"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Endpoints mais acessados no período"
            label="Top Endpoints — Sempre"
            isLoading={!metrics}
            hideXAxis
          />

          {/* Top Status Codes */}
          <BarChartCard
            data={metrics?.top_status_codes?.hoje}
            dataKey="status_code"
            barDataKey="total_respostas"
            description="Códigos de status mais frequentes"
            name="Total de respostas"
            label="Top Status Codes — Hoje"
            isLoading={!metrics}
            barColor="#10b981"
            activeBarColor="#ef467e"
            layout="horizontal"
          />
          <BarChartCard
            data={metrics?.top_status_codes?.sempre}
            dataKey="status_code"
            barDataKey="total_respostas"
            name="Total de respostas"
            description="Códigos de status mais frequentes"
            label="Top Status Codes — Sempre"
            isLoading={!metrics}
            barColor="#10b981"
            activeBarColor="#ef467e"
            layout="horizontal"
          />

          {/* Top HTTP Methods */}
          <BarChartCard
            data={metrics?.top_metodos_http?.hoje}
            dataKey="metodo_http"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Métodos HTTP mais utilizados"
            label="Top Métodos HTTP — Hoje"
            isLoading={!metrics}
            barColor="#06b6d4"
            activeBarColor="#ec4899"
            layout="horizontal"
          />
          <BarChartCard
            data={metrics?.top_metodos_http?.sempre}
            dataKey="metodo_http"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Métodos HTTP mais utilizados"
            label="Top Métodos HTTP — Sempre"
            isLoading={!metrics}
            barColor="#06b6d4"
            activeBarColor="#ec4899"
            layout="horizontal"
          />

          {/* Top Sectors */}
          <BarChartCard
            data={metrics?.top_setores?.hoje}
            dataKey="setor"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Setores com maior volume de requisições"
            label="Top Setores — Hoje"
            isLoading={!metrics}
            barColor="#3b82f6"
            activeBarColor="#34d399"
            layout="horizontal"
          />
          <BarChartCard
            data={metrics?.top_setores?.sempre}
            dataKey="setor"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Setores com maior volume de requisições"
            label="Top Setores — Sempre"
            isLoading={!metrics}
            barColor="#3b82f6"
            activeBarColor="#34d399"
            layout="horizontal"
          />

          {/* Top Clients */}
          <BarChartCard
            data={metrics?.top_clientes?.hoje}
            dataKey="nome_cliente"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Clientes que mais realizaram requisições"
            label="Top Clientes — Hoje"
            isLoading={!metrics}
            hideXAxis
            barColor="#d946ef"
            activeBarColor="#84cc16"
          />
          <BarChartCard
            data={metrics?.top_clientes?.sempre}
            dataKey="nome_cliente"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Clientes que mais realizaram requisições"
            label="Top Clientes — Sempre"
            isLoading={!metrics}
            hideXAxis
            barColor="#d946ef"
            activeBarColor="#84cc16"
          />

          {/* Peak Hours (Line Charts) */}
          <LineChartCard
            data={topHorasHoje}
            dataKey="hora"
            lineDataKey="total_requisicoes"
            name="Total de requisições"
            description="Distribuição de requisições por hora do dia"
            label="Horas de Pico — Hoje"
            isLoading={!metrics}
            lineColor="#8b5cf6"
            activeDotColor="#74a309"
          />
          <LineChartCard
            data={topHorasSempre}
            dataKey="hora"
            lineDataKey="total_requisicoes"
            name="Total de requisições"
            description="Distribuição de requisições por hora do dia"
            label="Horas de Pico — Sempre"
            isLoading={!metrics}
            lineColor="#8b5cf6"
            activeDotColor="#74a309"
          />

          {/* Top Days of Week */}
          <BarChartCard
            data={metrics?.top_dias_semana?.hoje}
            dataKey="dia_semana"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Dias com maior concentração de acessos"
            label="Top Dias da Semana"
            isLoading={!metrics}
            barColor="#f59e0b"
            activeBarColor="#0a61f4"
            layout="horizontal"
          />
          <BarChartCard
            data={metrics?.top_dias_semana?.sempre}
            dataKey="dia_semana"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Dias com maior concentração de acessos"
            label="Top Dias da Semana — Sempre"
            isLoading={!metrics}
            barColor="#f59e0b"
            activeBarColor="#0a61f4"
            layout="horizontal"
          />

          {/* Top Days of Month */}
          <BarChartCard
            data={topDiasMesHoje}
            dataKey="dia_mes"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Dias do mês com mais requisições"
            label="Top Dias do Mês"
            isLoading={!metrics}
            barColor="#f97316"
            activeBarColor="#16F99C"
            hideXAxis
          />
          <BarChartCard
            data={topDiasMesSempre}
            dataKey="dia_mes"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Dias do mês com mais requisições"
            label="Top Dias do Mês — Sempre"
            isLoading={!metrics}
            barColor="#f97316"
            activeBarColor="#16F99C"
            hideXAxis
          />

          {/* Worst Endpoints (highest error count) */}
          <BarChartCard
            data={metrics?.top_piores_endpoints?.hoje}
            dataKey="endpoint"
            name="Total de erros"
            barDataKey="total_erros"
            description="Endpoints com maior número de erros"
            label="Piores Endpoints — Hoje"
            isLoading={!metrics}
            hideXAxis
            barColor="#ef4444"
            activeBarColor="#10bbbb"
          />
          <BarChartCard
            data={metrics?.top_piores_endpoints?.sempre}
            dataKey="endpoint"
            name="Total de erros"
            barDataKey="total_erros"
            description="Endpoints com maior número de erros"
            label="Piores Endpoints — Sempre"
            isLoading={!metrics}
            hideXAxis
            barColor="#ef4444"
            activeBarColor="#10bbbb"
          />

          {/* Slowest Endpoints */}
          <BarChartCard
            data={metrics?.top_endpoints_mais_lentos?.hoje}
            dataKey="endpoint"
            name="Tempo médio de resposta"
            barDataKey="duracao"
            description="Endpoints com maior tempo médio de resposta"
            label="Endpoints mais Lentos — Hoje"
            isLoading={!metrics}
            hideXAxis
            barColor="#6c5ce7"
            activeBarColor="#fdcb6e"
          />
          <BarChartCard
            data={metrics?.top_endpoints_mais_lentos?.sempre}
            dataKey="endpoint"
            name="Tempo médio de resposta"
            barDataKey="duracao"
            description="Endpoints com maior tempo médio de resposta"
            label="Endpoints mais Lentos — Sempre"
            isLoading={!metrics}
            hideXAxis
            barColor="#6c5ce7"
            activeBarColor="#fdcb6e"
          />
        </div>
      </div>
    </>
  );
}
