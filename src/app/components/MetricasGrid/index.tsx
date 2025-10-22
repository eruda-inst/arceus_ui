"use client";

import React from "react";
import {
  FaArrowsRotate,
  FaGaugeHigh,
  FaCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { MetricaCard } from "@/app/components/MetricaCard";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { API_CONFIG } from "@/utils/config";
import { converterTempo } from "@/utils/helpers/converter";
import { useWebSocket } from "@/hooks/useWebSocket";

interface TotalRequisicoes {
  total_requisicoes: number;
}

interface TempoMedioResposta {
  tempo_medio_resposta: number;
}

interface TaxaSucesso {
  taxa_sucesso: number;
}

interface TaxaErro {
  taxa_erro: number;
}

export function MetricasGrid() {
  const {
    data: totalData,
    isLoading: isTotalLoading,
    isError: isTotalError,
  } = useWebSocket<TotalRequisicoes>(API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES);

  const {
    data: tempoMedioData,
    isLoading: isTempoMedioLoading,
    isError: isTempoMedioError,
  } = useWebSocket<TempoMedioResposta>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA
  );

  const {
    data: taxaSucessoData,
    isLoading: isTaxaSucessoLoading,
    isError: isTaxaSucessoError,
  } = useWebSocket<TaxaSucesso>(API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO);

  const {
    data: taxaErroData,
    isLoading: isTaxaErroLoading,
    isError: isTaxaErroError,
  } = useWebSocket<TaxaErro>(API_CONFIG.WS_ENDPOINTS.TAXA_ERRO);

  const metrics = [
    {
      id: "total-requisicoes",
      title: "Total Requisições",
      value: isTotalLoading ? (
        <FetchingLoadingMensagem />
      ) : isTotalError ? (
        <FetchingMensagemErro />
      ) : typeof totalData?.total_requisicoes === "number" ? (
        totalData.total_requisicoes
      ) : (
        "N/A"
      ),
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "tempo-medio-resposta",
      title: "T. Médio de Resposta",
      value: isTempoMedioLoading ? (
        <FetchingLoadingMensagem />
      ) : isTempoMedioError ? (
        <FetchingMensagemErro />
      ) : typeof tempoMedioData?.tempo_medio_resposta === "number" ? (
        converterTempo(tempoMedioData.tempo_medio_resposta)
      ) : (
        "N/A"
      ),
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "taxa-sucesso",
      title: "Taxa de Sucesso",
      value: isTaxaSucessoLoading ? (
        <FetchingLoadingMensagem />
      ) : isTaxaSucessoError ? (
        <FetchingMensagemErro />
      ) : typeof taxaSucessoData?.taxa_sucesso === "number" ? (
        `${taxaSucessoData.taxa_sucesso.toFixed(2)}%`
      ) : (
        "N/A"
      ),
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "taxa-erro",
      title: "Taxa de Erro",
      value: isTaxaErroLoading ? (
        <FetchingLoadingMensagem />
      ) : isTaxaErroError ? (
        <FetchingMensagemErro />
      ) : typeof taxaErroData?.taxa_erro === "number" ? (
        `${taxaErroData.taxa_erro.toFixed(2)}%`
      ) : (
        "N/A"
      ),
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const icons = [FaArrowsRotate, FaGaugeHigh, FaCheck, FaTriangleExclamation];

  return (
    <ul className="grid grid-cols-4 gap-4">
      {metrics.map(({ id, title, value, iconBgColor, iconColor }, index) => (
        <MetricaCard
          key={id}
          title={title}
          value={React.isValidElement(value) ? value : String(value)}
          iconBgColor={iconBgColor}
          iconColor={iconColor}
        >
          {React.createElement(icons[index])}
        </MetricaCard>
      ))}
    </ul>
  );
}

MetricasGrid.displayName = "MetricasGrid";
