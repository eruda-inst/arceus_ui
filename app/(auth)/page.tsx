// Faça renderização de lista para os gráficos de barras

"use client";

import { Grid } from "@/ui/Grid/Grid";
import { RequisicoesPorHora } from "@/ui/RequisicoesPorHora/RequisicoesPorHora";
import { TableTwoCols } from "@/ui/TableTwoCols/TableTwoCols";
import { API_CONFIG } from "@/config/config";
import { TableOneCol } from "@/ui/TableOneCol/TableOneCol";
import { Metric } from "@/ui/Metric/Metric";
import { formatarPorcentagem } from "@/helpers/formatar";
import { converterTempo } from "@/helpers/converter";
import { ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { GraficoBarra } from "@/ui/GraficoBarra/GraficoBarra";

interface MetricConfig {
  title: string;
  endpointGeral: string;
  endpointHoje: string;
  dataKeyGeral: string;
  dataKeyHoje: string;
  formatter?: (value: any) => ReactNode;
  errorClassName?: string;
}

interface TableConfig {
  title: string;
  websocketEndpoint: string;
  dataKey: string;
}

interface DistribuicaoAcessosDiaSemanaData {
  [key: string]: number;
}

interface DistribuicaoAcessosDiaSemanaOut {
  distribuicao_acessos_dia_semana: DistribuicaoAcessosDiaSemanaData;
}

interface DistribuicaoAcessosDiaSemanaTransformed {
  diaSemana: string;
  acessos: number;
}

function transformDistribuicaoAcessosDiaSemana(
  data: DistribuicaoAcessosDiaSemanaOut | null | undefined
): DistribuicaoAcessosDiaSemanaTransformed[] {
  if (!data?.distribuicao_acessos_dia_semana) return [];

  const acessosPordiaSemana = data.distribuicao_acessos_dia_semana;
  const transformedData: DistribuicaoAcessosDiaSemanaTransformed[] = [];

  Object.keys(acessosPordiaSemana).forEach((diaSemana) => {
    const acessos = acessosPordiaSemana[diaSemana];
    if (acessos > 0) {
      transformedData.push({ diaSemana, acessos });
    }
  });

  return transformedData;
}

interface DistribuicaoAcessosHoraData {
  [key: string]: number;
}

interface DistribuicaoAcessosHoraOut {
  distribuicao_acessos_hora: DistribuicaoAcessosHoraData;
}

interface DistribuicaoAcessosHoraTransformed {
  hora: string;
  acessos: number;
}

function transformDistribuicaoAcessosHora(
  data: DistribuicaoAcessosHoraOut | null | undefined
): DistribuicaoAcessosHoraTransformed[] {
  if (!data?.distribuicao_acessos_hora) return [];

  const acessosPorHora = data.distribuicao_acessos_hora;
  const transformedData: DistribuicaoAcessosHoraTransformed[] = [];

  Object.keys(acessosPorHora).forEach((hora) => {
    const acessos = acessosPorHora[hora];
    if (acessos > 0) {
      transformedData.push({
        hora: `${hora}:00`,
        acessos,
      });
    }
  });

  transformedData.sort((a, b) => {
    const horaA = parseInt(a.hora.split(":")[0]);
    const horaB = parseInt(b.hora.split(":")[0]);
    return horaA - horaB;
  });

  return transformedData;
}

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

function transformDistribuicaoStatusCode(
  data: DistribuicaoStatusCodeOut | null | undefined
): DistribuicaoStatusCodeTransformed[] {
  if (!data?.distribuicao_status_code) return [];

  const statusCodesMap = data.distribuicao_status_code;
  const transformedData: DistribuicaoStatusCodeTransformed[] = [];

  Object.keys(statusCodesMap).forEach((key) => {
    const total = statusCodesMap[key];
    const statusCodeMatch = key.match(/status_(\d+)/);

    if (statusCodeMatch && total > 0) {
      transformedData.push({
        statusCode: statusCodeMatch[1],
        total,
      });
    }
  });

  transformedData.sort(
    (a, b) => parseInt(a.statusCode) - parseInt(b.statusCode)
  );

  return transformedData;
}

export default function Home() {
  const metrics: MetricConfig[] = [
    {
      title: "Total de Requisições",
      endpointGeral: API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES,
      endpointHoje: API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES_HOJE,
      dataKeyGeral: "total_requisicoes",
      dataKeyHoje: "total_requisicoes_hoje",
      formatter: undefined,
      errorClassName: undefined,
    },
    {
      title: "T. Médio de Resposta",
      endpointGeral: API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA,
      endpointHoje: API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA_HOJE,
      dataKeyGeral: "tempo_medio_resposta",
      dataKeyHoje: "tempo_medio_resposta_hoje",
      formatter: converterTempo,
      errorClassName: undefined,
    },
    {
      title: "Taxa de Sucesso",
      endpointGeral: API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO,
      endpointHoje: API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO_HOJE,
      dataKeyGeral: "taxa_sucesso",
      dataKeyHoje: "taxa_sucesso_hoje",
      formatter: formatarPorcentagem,
      errorClassName: undefined,
    },
    {
      title: "Taxa de Erro",
      endpointGeral: API_CONFIG.WS_ENDPOINTS.TAXA_ERRO,
      endpointHoje: API_CONFIG.WS_ENDPOINTS.TAXA_ERRO_HOJE,
      dataKeyGeral: "taxa_erro",
      dataKeyHoje: "taxa_erro_hoje",
      formatter: formatarPorcentagem,
      errorClassName: "text-red-500 mt-0",
    },
  ];

  const tableTwoCols: TableConfig[] = [
    {
      title: "Endpoints Mais Acessados (todo o período)",
      websocketEndpoint: API_CONFIG.WS_ENDPOINTS.TOP_ENDPOINTS,
      dataKey: "top_endpoints",
    },
    {
      title: "Endpoints Com mais Erros (todo o período)",
      websocketEndpoint: API_CONFIG.WS_ENDPOINTS.ENDPOINTS_COM_MAIS_ERROS,
      dataKey: "endpoints_com_mais_erros",
    },
  ];

  const tableOneCol: TableConfig[] = [
    {
      title: "Requisições Recentes com Erro (todo o período)",
      websocketEndpoint: API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES_ERRO,
      dataKey: "requisicoes_recentes_erro",
    },
    {
      title: "Requisições Recentes (todo o período)",
      websocketEndpoint: API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES,
      dataKey: "requisicoes_recentes",
    },
  ];

  const graficosBarras = [
    {
      endpoint: API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_STATUS_CODE,
      cardTitle: "Distribuição de Status Codes (todo o período)",
      transformData: transformDistribuicaoStatusCode,
      xKey: "statusCode" as const,
      yKey: "total" as const,
      barName: "Número de Ocorrências",
    },
    {
      endpoint: API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_ACESSOS_HORA,
      cardTitle: "Distribuição de Acessos por Hora (todo o período)",
      transformData: transformDistribuicaoAcessosHora,
      xKey: "hora" as const,
      yKey: "acessos" as const,
      barName: "Número de Acessos",
      fill: "var(--chart-3)",
      activeBarColor: "var(--chart-3)",
    },
    {
      endpoint: API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_ACESSOS_DIA_SEMANA,
      cardTitle: "Distribuição de Acessos por Dia da Semana (todo o período)",
      transformData: transformDistribuicaoAcessosDiaSemana,
      xKey: "diaSemana" as const,
      yKey: "acessos" as const,
      barName: "Número de Acessos",
      fill: "var(--chart-4)",
      activeBarColor: "var(--chart-4)",
    },
  ];

  return (
    <>
      <Grid className="grid-cols-4">
        {metrics.map((metric) => (
          <Metric
            key={uuid()}
            title={metric.title}
            endpointGeral={metric.endpointGeral}
            endpointHoje={metric.endpointHoje}
            dataKeyGeral={metric.dataKeyGeral}
            dataKeyHoje={metric.dataKeyHoje}
            formatter={metric.formatter}
            errorClassName={metric.errorClassName}
          />
        ))}
      </Grid>

      <Grid>
        <RequisicoesPorHora />
        {graficosBarras.map((grafico) => (
          <GraficoBarra
            key={uuid()}
            endpoint={grafico.endpoint}
            cardTitle={grafico.cardTitle}
            transformData={grafico.transformData}
            xKey={grafico.xKey}
            yKey={grafico.yKey}
            barName={grafico.barName}
            fill={grafico.fill}
            activeBarColor={grafico.activeBarColor}
          />
        ))}
      </Grid>

      <Grid>
        {tableTwoCols.map((table) => (
          <TableTwoCols
            key={uuid()}
            title={table.title}
            websocketEndpoint={table.websocketEndpoint}
            dataKey={table.dataKey}
          />
        ))}
      </Grid>

      {tableOneCol.map((table) => (
        <TableOneCol
          key={uuid()}
          title={table.title}
          websocketEndpoint={table.websocketEndpoint}
          dataKey={table.dataKey}
        />
      ))}
    </>
  );
}

Home.displayName = "Home";
