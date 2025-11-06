"use client";

import { Grid } from "@/ui/Grid/Grid";
import { TotalRequisicoes } from "@/ui/TotalRequisicoes/TotalRequisicoes";
import { TempoMedioResposta } from "@/ui/TempoMedioResposta/TempoMedioResposta";
import { TaxaSucesso } from "@/ui/TaxaSucesso/TaxaSucesso";
import { TaxaErro } from "@/ui/TaxaErro/TaxaErro";
import { RequisicoesPorHora } from "@/ui/RequisicoesPorHora/RequisicoesPorHora";
import { DistribuicaoStatusCode } from "@/ui/DistribuicaoStatusCode/DistribuicaoStatusCode";
import { TopEndpoints } from "@/ui/TopEndpoints/TopEndpoints";
import { RequisicoesRecentesErro } from "@/ui/RequisicoesRecentesErro/RequisicoesRecentesErro";
import { RequisicoesRecentes } from "@/ui/RequisicoesRecentes/RequisicoesRecentes";
import { DistribuicaoAcessosHora } from "@/ui/DistribuicaoAcessosHora/DistribuicaoAcessosHora";
import { DistribuicaoAcessosDiaSemana } from "@/ui/DistribuicaoAcessosDiaSemana/DistribuicaoAcessosDiaSemana";

export default function Home() {
  return (
    <>
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
        <DistribuicaoAcessosHora />
        <DistribuicaoAcessosDiaSemana />
      </Grid>
      <Grid>
        <TopEndpoints />
      </Grid>
      <RequisicoesRecentesErro />
      <RequisicoesRecentes />
    </>
  );
}

Home.displayName = "Home";
