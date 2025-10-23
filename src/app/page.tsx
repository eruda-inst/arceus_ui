"use client";

import { FaChartLine } from "react-icons/fa6";
import { PageHeader } from "@/app/components/PageHeader";
import { PageSidebar } from "@/app/components/PageSidebar";
import { SidebarTitle } from "@/app/components/SidebarTitle";
import { SidebarNav } from "@/app/components/SidebarNav";
import { SidebarNavItem } from "@/app/components/SidebarNavItem";
import { PageContent } from "@/app/components/PageContent";
import { Grid } from "@/app/components/Grid";
import { TotalRequisicoes } from "@/app/components/TotalRequisicoes";
import { TempoMedioResposta } from "@/app/components/TempoMedioResposta";
import { TaxaSucesso } from "@/app/components/TaxaSucesso";
import { TaxaErro } from "@/app/components/TaxaErro";
import { RequisicoesPorHora } from "@/app/components/RequisicoesPorHora";
import { DistribuicaoStatusCode } from "@/app/components/DistribuicaoStatusCode";
import { TopEndpoints } from "@/app/components/TopEndpoints";
import { RequisicoesRecentesErro } from "@/app/components/RequisicoesRecentesErro";
import { RequisicoesRecentes } from "@/app/components/RequisicoesRecentes";

export default function Home() {
  return (
    <>
      <PageHeader />
      <PageSidebar>
        <SidebarTitle />
        <SidebarNav>
          <SidebarNavItem>
            <FaChartLine /> Dashboard
          </SidebarNavItem>
        </SidebarNav>
      </PageSidebar>
      <PageContent>
        <Grid className="grid-cols-4">
          <TotalRequisicoes />
          <TempoMedioResposta />
          <TaxaSucesso />
          <TaxaErro />
        </Grid>
        <Grid>
          <RequisicoesPorHora />
          <DistribuicaoStatusCode />
        </Grid>
        <Grid>
          <TopEndpoints />
          <RequisicoesRecentesErro />
        </Grid>
        <RequisicoesRecentes />
      </PageContent>
    </>
  );
}

Home.displayName = "Home";
