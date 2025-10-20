"use client";

import { useQueries } from "@tanstack/react-query";
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
import { API_CONFIG } from "@/utils/config";
import { fetchDados } from "@/utils/helpers/fetch";

interface RequisicaoPorHora {
  hora: string;
  total: number;
}

interface DistribuicaoStatusCode {
  statusCode: string;
  total: number;
}

interface DistribuicaoStatusCodeOut {
  distribuicao_status_code: DistribuicaoStatusCode[];
}

export default function Home() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["requisicoes_por_hora"],
        queryFn: async function () {
          return await fetchDados(API_CONFIG.ENDPOINTS.REQUISICOES_POR_HORA);
        },
      },
      {
        queryKey: ["distribuicao_status_code"],
        queryFn: async function () {
          return await fetchDados(
            API_CONFIG.ENDPOINTS.DISTRIBUICAO_STATUS_CODE
          );
        },
      },
    ],
  });

  function transformDistribuicaoStatusCode(
    data: DistribuicaoStatusCodeOut
  ): DistribuicaoStatusCodeOut {
    if (!data?.distribuicao_status_code) {
      return { distribuicao_status_code: [] };
    }

    const codes = [200, 201, 202, 204, 400, 404, 405, 422, 500];
    const transformedData = Object.values(data.distribuicao_status_code).map(
      (value, index) => ({
        statusCode: String(codes[index]),
        total: Number(value),
      })
    );

    return { distribuicao_status_code: transformedData };
  }

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
            {queries[0].isLoading ? (
              <FetchingLoadingMensagem />
            ) : queries[0].isError ? (
              <FetchingMensagemErro />
            ) : (
              <LineChartComponent
                data={queries[0]?.data?.requisicoes_por_hora}
                xKey="hora"
                yKey="total"
                lineName="Número de Requisições"
                showDots={true}
              />
            )}
          </ChartWrapper>
          <ChartWrapper>
            <h3 className="text-left w-full">Distribuição de Status Codes</h3>
            {queries[1].isLoading ? (
              <FetchingLoadingMensagem />
            ) : queries[1].isError ? (
              <FetchingMensagemErro />
            ) : (
              <BarChartComponent
                data={
                  transformDistribuicaoStatusCode(queries[1]?.data)
                    ?.distribuicao_status_code
                }
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
