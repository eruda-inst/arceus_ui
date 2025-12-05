"use client";

import { Grid } from "@/ui/Grid/Grid";
import { RequisicoesPorHora } from "@/ui/RequisicoesPorHora/RequisicoesPorHora";
import { TotalRequisicoes } from "@/ui/TotalRequisicoes/TotalRequisicoes";
import { TempoMedioResposta } from "@/ui/TempoMedioResposta/TempoMedioResposta";
import { TaxaSucesso } from "@/ui/TaxaSucesso/TaxaSucesso";
import { TaxaErro } from "@/ui/TaxaErro/TaxaErro";
import { TotalAtendimentos } from "@/ui/TotalAtendimentos/TotalAtendimentos";
import { DistribuicaoStatusCodes } from "@/ui/DistribuicaoStatusCodes/DistribuicaoStatusCodes";
import { DistribuicaoRequisicoesHora } from "@/ui/DistribuicaoRequisicoesHora/DistribuicaoRequisicoesHora";
import { DistribuicaoRequisicoesDiaSemana } from "@/ui/DistribuicaoRequisicoesDiaSemana/DistribuicaoRequisicoesDiaSemana";
import { EndpointsMaisRequisitados } from "@/ui/EndpointsMaisRequisitados/EndpointsMaisRequisitados";
import { EndpointsComMaisErros } from "@/ui/EndpointsComMaisErros/EndpointsComMaisErros";
import { RequisicoesRecentesComErro } from "@/ui/RequisicoesRecentesComErro/RequisicoesRecentesComErro";
import { RequisicoesRecentes } from "@/ui/RequisicoesRecentes/RequisicoesRecentes";

export default function Home() {
  return (
    <>
      <Grid className="grid-cols-3">
        <TotalRequisicoes />
        <TempoMedioResposta />
        <TaxaSucesso />
        <TaxaErro />
        <TotalAtendimentos />
      </Grid>
      <Grid>
        <RequisicoesPorHora />
        <DistribuicaoStatusCodes />
        <DistribuicaoRequisicoesHora />
        <DistribuicaoRequisicoesDiaSemana />
      </Grid>
      <Grid>
        <EndpointsMaisRequisitados />
        <EndpointsComMaisErros />
      </Grid>
      <RequisicoesRecentesComErro />
      <RequisicoesRecentes />
    </>
  );
}

Home.displayName = "Home";
