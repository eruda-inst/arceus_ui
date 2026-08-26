"use client";

import useMetricWebSocket from "@/hooks/useMetricWebSocket.hook";
import { ColorSwatch } from "@heroui/react";
import clsx from "clsx";
import CustomBar from "@/components/Charts/CustomBar";
import OneLineChart from "@/components/Charts/OneLine";
import { MetricCard } from "@/components/MetricCard/MetricCard";
import { API_ENDPOINT_BASES } from "@/configs/api.config";

export default function Metrics() {
  const { isConnected, isConnecting, lastMessage } = useMetricWebSocket({
    url: API_ENDPOINT_BASES.metric,
    initialMetrics: "all",
  });

  const topHorasHoje = lastMessage?.top_horas?.hoje
    ? [...lastMessage.top_horas.hoje]
        .sort((a, b) => Number(a.hora) - Number(b.hora))
        .map((item) => ({ ...item, hora: `${item.hora}h` }))
    : [];

  const topHorasSempre = lastMessage?.top_horas?.sempre
    ? [...lastMessage.top_horas.sempre]
        .sort((a, b) => Number(a.hora) - Number(b.hora))
        .map((item) => ({ ...item, hora: `${item.hora}h` }))
    : [];

  const topDiasMesHoje = lastMessage?.top_dias_mes?.hoje
    ? [...lastMessage.top_dias_mes.hoje].sort((a, b) => a.dia_mes - b.dia_mes)
    : [];

  const topDiasMesSempre = lastMessage?.top_dias_mes?.sempre
    ? [...lastMessage.top_dias_mes.sempre].sort((a, b) => a.dia_mes - b.dia_mes)
    : [];

  return (
    <>
      {/* Metric cards */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Métricas
          </h1>
          <p className="text-muted">
            As métricas são atualizadas automaticamente, não é necessário
            recarregar a página
          </p>
        </div>
        <span
          className={clsx(
            "flex items-center gap-x-2",
            isConnected ? "text-[#0f0]" : "text-[#f00]",
          )}
        >
          {isConnected ? "Conectado" : "Desconectado"}
          <ColorSwatch
            className="animate-bounce"
            size="xs"
            color={isConnected ? "#0f0" : "#f00"}
          />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Erros */}
        <MetricCard
          title="Malsucedidas"
          description="Total de requisições malsucedidas"
          metrics={[
            {
              label: "Taxa",
              value: {
                hoje: lastMessage?.erros?.hoje?.percentual ?? 0,
                sempre: lastMessage?.erros?.sempre?.percentual ?? 0,
              },
              format: (v: number) => `${v.toFixed(2).replace(".", ",")}%`,
            },
            {
              label: "Total",
              value: {
                hoje: lastMessage?.erros?.hoje?.total ?? 0,
                sempre: lastMessage?.erros?.sempre?.total ?? 0,
              },
            },
          ]}
          isLoading={isConnecting}
        />

        {/* Sucessos */}
        <MetricCard
          title="Bem-sucedidas"
          description="Total de requisições bem-sucedidas"
          metrics={[
            {
              label: "Taxa",
              value: {
                hoje: lastMessage?.sucessos?.hoje?.percentual ?? 0,
                sempre: lastMessage?.sucessos?.sempre?.percentual ?? 0,
              },
              format: (v: number) => `${v.toFixed(2).replace(".", ",")}%`,
            },
            {
              label: "Total",
              value: {
                hoje: lastMessage?.sucessos?.hoje?.total ?? 0,
                sempre: lastMessage?.sucessos?.sempre?.total ?? 0,
              },
            },
          ]}
          isLoading={isConnecting}
        />

        {/* Tempo de Resposta (agora com 3 métricas) */}
        <MetricCard
          title="Tempo de Resposta"
          description="Mínimo, média e máximo (em segundos)"
          metrics={[
            {
              label: "Mín",
              value: {
                hoje: lastMessage?.tempo_resposta?.hoje?.min ?? 0,
                sempre: lastMessage?.tempo_resposta?.sempre?.min ?? 0,
              },
              format: (v: number) => v.toFixed(3).replace(".", ","),
            },
            {
              label: "Méd",
              value: {
                hoje: lastMessage?.tempo_resposta?.hoje?.avg ?? 0,
                sempre: lastMessage?.tempo_resposta?.sempre?.avg ?? 0,
              },
              format: (v: number) => v.toFixed(3).replace(".", ","),
            },
            {
              label: "Máx",
              value: {
                hoje: lastMessage?.tempo_resposta?.hoje?.max ?? 0,
                sempre: lastMessage?.tempo_resposta?.sempre?.max ?? 0,
              },
              format: (v: number) => v.toFixed(3).replace(".", ","),
            },
          ]}
          isLoading={isConnecting}
        />

        {/* Requisições (apenas Total) */}
        <MetricCard
          title="Requisições"
          description="Total de requisições realizadas"
          metrics={[
            {
              label: "Total",
              value: {
                hoje: lastMessage?.total_requisicoes?.hoje ?? 0,
                sempre: lastMessage?.total_requisicoes?.sempre ?? 0,
              },
            },
          ]}
          isLoading={isConnecting}
        />

        {/* Atendimentos (apenas Total) */}
        <MetricCard
          title="Atendimentos"
          description="Total de atendimentos realizados"
          metrics={[
            {
              label: "Total",
              value: {
                hoje: lastMessage?.total_atendimentos?.hoje ?? 0,
                sempre: lastMessage?.total_atendimentos?.sempre ?? 0,
              },
            },
          ]}
          isLoading={isConnecting}
        />
      </div>

      {/* Metric charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top endpoints */}
        <CustomBar
          data={lastMessage?.top_endpoints?.hoje}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Endpoints mais acessados no período"
          label="Top Endpoints — Hoje"
          isLoading={isConnecting}
          hideXAxis
        />
        <CustomBar
          data={lastMessage?.top_endpoints?.sempre}
          dataKey="endpoint"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Endpoints mais acessados no período"
          label="Top Endpoints — Sempre"
          isLoading={isConnecting}
          hideXAxis
        />

        {/* Top status codes */}
        <CustomBar
          data={lastMessage?.top_status_codes?.hoje}
          dataKey="status_code"
          barDataKey="total_respostas"
          description="Códigos de status mais frequentes"
          name="Total de respostas"
          label="Top Status Codes — Hoje"
          isLoading={isConnecting}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="horizontal"
        />
        <CustomBar
          data={lastMessage?.top_status_codes?.sempre}
          dataKey="status_code"
          barDataKey="total_respostas"
          name="Total de respostas"
          description="Códigos de status mais frequentes"
          label="Top Status Codes — Sempre"
          isLoading={isConnecting}
          barColor="#10b981"
          activeBarColor="#ef467e"
          layout="horizontal"
        />

        {/* Top métodos HTTP */}
        <CustomBar
          data={lastMessage?.top_metodos_http?.hoje}
          dataKey="metodo_http"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Métodos HTTP mais utilizados"
          label="Top Métodos HTTP — Hoje"
          isLoading={isConnecting}
          barColor="#06b6d4"
          activeBarColor="#ec4899"
          layout="horizontal"
        />
        <CustomBar
          data={lastMessage?.top_metodos_http?.sempre}
          dataKey="metodo_http"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Métodos HTTP mais utilizados"
          label="Top Métodos HTTP — Sempre"
          isLoading={isConnecting}
          barColor="#06b6d4"
          activeBarColor="#ec4899"
          layout="horizontal"
        />

        {/* Top setores */}
        <CustomBar
          data={lastMessage?.top_setores?.hoje}
          dataKey="setor"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Setores com maior volume de requisições"
          label="Top Setores — Hoje"
          isLoading={isConnecting}
          barColor="#3b82f6"
          activeBarColor="#34d399"
          layout="horizontal"
        />
        <CustomBar
          data={lastMessage?.top_setores?.sempre}
          dataKey="setor"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Setores com maior volume de requisições"
          label="Top Setores — Sempre"
          isLoading={isConnecting}
          barColor="#3b82f6"
          activeBarColor="#34d399"
          layout="horizontal"
        />

        {/* Top clientes */}
        <CustomBar
          data={lastMessage?.top_clientes?.hoje}
          dataKey="nome_cliente"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Clientes que mais realizaram requisições"
          label="Top Clientes — Hoje"
          isLoading={isConnecting}
          hideXAxis
          barColor="#d946ef"
          activeBarColor="#84cc16"
        />
        <CustomBar
          data={lastMessage?.top_clientes?.sempre}
          dataKey="nome_cliente"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Clientes que mais realizaram requisições"
          label="Top Clientes — Sempre"
          isLoading={isConnecting}
          hideXAxis
          barColor="#d946ef"
          activeBarColor="#84cc16"
        />

        {/* Horas de pico */}
        <OneLineChart
          data={topHorasHoje}
          dataKey="hora"
          lineDataKey="total_requisicoes"
          name="Total de requisições"
          description="Distribuição de requisições por hora do dia"
          label="Horas de Pico — Hoje"
          isLoading={isConnecting}
          lineColor="#8b5cf6"
          activeDotColor="#74a309"
        />
        <OneLineChart
          data={topHorasSempre}
          dataKey="hora"
          lineDataKey="total_requisicoes"
          name="Total de requisições"
          description="Distribuição de requisições por hora do dia"
          label="Horas de Pico — Sempre"
          isLoading={isConnecting}
          lineColor="#8b5cf6"
          activeDotColor="#74a309"
        />

        {/* Top dias da semana */}
        <CustomBar
          data={lastMessage?.top_dias_semana?.hoje}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias com maior concentração de acessos"
          label="Top Dias da Semana"
          isLoading={isConnecting}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="horizontal"
        />
        <CustomBar
          data={lastMessage?.top_dias_semana?.sempre}
          dataKey="dia_semana"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias com maior concentração de acessos"
          label="Top Dias da Semana — Sempre"
          isLoading={isConnecting}
          barColor="#f59e0b"
          activeBarColor="#0a61f4"
          layout="horizontal"
        />

        {/* Top dias do mês */}
        <CustomBar
          data={topDiasMesHoje}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias do mês com mais requisições"
          label="Top Dias do Mês"
          isLoading={isConnecting}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
        />
        <CustomBar
          data={topDiasMesSempre}
          dataKey="dia_mes"
          barDataKey="total_requisicoes"
          name="Total de requisições"
          description="Dias do mês com mais requisições"
          label="Top Dias do Mês — Sempre"
          isLoading={isConnecting}
          barColor="#f97316"
          activeBarColor="#16F99C"
          hideXAxis
        />

        {/* Top piores endpoints */}
        <CustomBar
          data={lastMessage?.top_piores_endpoints?.hoje}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          description="Endpoints com maior número de erros"
          label="Piores Endpoints — Hoje"
          isLoading={isConnecting}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />
        <CustomBar
          data={lastMessage?.top_piores_endpoints?.sempre}
          dataKey="endpoint"
          name="Total de erros"
          barDataKey="total_erros"
          description="Endpoints com maior número de erros"
          label="Piores Endpoints — Sempre"
          isLoading={isConnecting}
          hideXAxis
          barColor="#ef4444"
          activeBarColor="#10bbbb"
        />

        {/* Top endpoints mais lentos */}
        <CustomBar
          data={lastMessage?.top_endpoints_mais_lentos?.hoje}
          dataKey="endpoint"
          name="Tempo médio de resposta"
          barDataKey="duracao"
          description="Endpoints com maior tempo médio de resposta"
          label="Endpoints mais Lentos — Hoje"
          isLoading={isConnecting}
          hideXAxis
          barColor="#6c5ce7"
          activeBarColor="#fdcb6e"
        />
        <CustomBar
          data={lastMessage?.top_endpoints_mais_lentos?.sempre}
          dataKey="endpoint"
          name="Tempo médio de resposta"
          barDataKey="duracao"
          description="Endpoints com maior tempo médio de resposta"
          label="Endpoints mais Lentos — Sempre"
          isLoading={isConnecting}
          hideXAxis
          barColor="#6c5ce7"
          activeBarColor="#fdcb6e"
        />
      </div>
    </>
  );
}
