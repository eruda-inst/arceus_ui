"use client";

import useMetricWebSocket from "@/hooks/useMetricWebSocket.hook";
import { Typography } from "@heroui/react";
import CustomBar from "@/components/Charts/CustomBar";
import CustomLine from "@/components/Charts/CustomLine";
import { MetricCard } from "@/components/MetricCard";
import { API_ROUTES } from "@/configs/api.config";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";

export default function Metrics() {
  const { isConnected, isConnecting, lastMessage } = useMetricWebSocket({
    url: API_ROUTES.metricWs,
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
      <div className="container mx-auto p-2">
        {/* Metric cards */}
        <div className="flex justify-between items-center mb-6">
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
            hideXAxis
          />
          <CustomBar
            data={lastMessage?.top_endpoints?.sempre}
            dataKey="endpoint"
            barDataKey="total_requisicoes"
            name="Total de requisições"
            description="Endpoints mais acessados no período"
            label="Top Endpoints — Sempre"
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
            hideXAxis
            barColor="#d946ef"
            activeBarColor="#84cc16"
          />

          {/* Horas de pico */}
          <CustomLine
            data={topHorasHoje}
            dataKey="hora"
            lineDataKey="total_requisicoes"
            name="Total de requisições"
            description="Distribuição de requisições por hora do dia"
            label="Horas de Pico — Hoje"
            isLoading={!lastMessage}
            lineColor="#8b5cf6"
            activeDotColor="#74a309"
          />
          <CustomLine
            data={topHorasSempre}
            dataKey="hora"
            lineDataKey="total_requisicoes"
            name="Total de requisições"
            description="Distribuição de requisições por hora do dia"
            label="Horas de Pico — Sempre"
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
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
            isLoading={!lastMessage}
            hideXAxis
            barColor="#6c5ce7"
            activeBarColor="#fdcb6e"
          />
        </div>
      </div>
    </>
  );
}
