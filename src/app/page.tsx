"use client";

import { FaChartLine } from "react-icons/fa6";
import { PageHeader } from "@/app/components/PageHeader";
import { PageSidebar } from "@/app/components/PageSidebar";
import { SidebarTitle } from "@/app/components/SidebarTitle";
import { SidebarNav } from "@/app/components/SidebarNav";
import { SidebarNavItem } from "@/app/components/SidebarNavItem";
import { PageContent } from "@/app/components/PageContent";
import { MetricasGrid } from "@/app/components/MetricasGrid";
import { ChartsGrid } from "@/app/components/ChartsGrid";
import { BottomGrid } from "@/app/components/BottomGrid";
import { TopEndpoints } from "@/app/components/TopEndpoints";
import { RequisicoesRecentesErro } from "@/app/components/RequisicoesRecentesErro";
import { RequisicoesRecentes } from "@/app/components/RequisicoesRecentes";
import { ChartWrapper } from "@/app/components/ChartWrapper";
import { LineChartComponent } from "@/app/components/LineChartComponent";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { MensagemErro } from "@/app/components/MensagemErro";
import { API_CONFIG } from "@/utils/config";
import { useWebSocket } from "@/hooks/useWebSocket";

interface RequisicaoPorHora {
  hora: string;
  total: number;
}

interface RequisicoesPorHoraOut {
  requisicoes_por_hora: RequisicaoPorHora[];
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

export default function Home() {
  const {
    data: reqPorHoraData,
    isLoading: reqPorHoraIsLoading,
    isError: reqPorHoraIsError,
  } = useWebSocket<RequisicoesPorHoraOut>(
    API_CONFIG.WS_ENDPOINTS.REQUISICOES_POR_HORA
  );

  const {
    data: distribucaoStatusCodeData,
    isLoading: distribucaoStatusCodeIsLoading,
    isError: distribucaoStatusCodeIsError,
  } = useWebSocket<DistribuicaoStatusCodeOut>(
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

  const distribuicaoTransformada = transformDistribuicaoStatusCode(
    distribucaoStatusCodeData
  );

  return (
    <>
      <PageHeader />
      <PageSidebar>
        <SidebarTitle>Aggregator &middot; Monitor</SidebarTitle>
        <SidebarNav>
          <SidebarNavItem>
            <FaChartLine /> Dashboard
          </SidebarNavItem>
        </SidebarNav>
      </PageSidebar>
      <PageContent>
        <MetricasGrid />
        <ChartsGrid>
          <ChartWrapper>
            <h3 className="text-left w-full">Requisições por Hora</h3>
            {reqPorHoraIsLoading ? (
              <FetchingLoadingMensagem />
            ) : reqPorHoraIsError ? (
              <FetchingMensagemErro />
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
          </ChartWrapper>
          <ChartWrapper>
            <h3 className="text-left w-full">Distribuição de Status Codes</h3>
            {distribucaoStatusCodeIsLoading ? (
              <FetchingLoadingMensagem />
            ) : distribucaoStatusCodeIsError ? (
              <FetchingMensagemErro />
            ) : distribuicaoTransformada.length === 0 ? (
              <MensagemErro>Sem dados</MensagemErro>
            ) : (
              <BarChartComponent
                data={distribuicaoTransformada}
                xKey="statusCode"
                yKey="total"
                barName="Número de Ocorrências"
              />
            )}
          </ChartWrapper>
        </ChartsGrid>
        <BottomGrid>
          <TopEndpoints />
          <RequisicoesRecentesErro />
        </BottomGrid>
        <RequisicoesRecentes />
      </PageContent>
    </>
  );
}

Home.displayName = "Home";
