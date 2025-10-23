"use client";

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
    </>
  );
}

Home.displayName = "Home";
