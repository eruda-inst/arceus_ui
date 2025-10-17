"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FaArrowsRotate,
  FaGaugeHigh,
  FaCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useQueries } from "@tanstack/react-query";
import { MetricaCard } from "@/app/components/MetricaCard";
import { fetchDados } from "@/utils/helpers/fetch";
import { API_CONFIG } from "@/utils/config";

export function MetricasGrid() {
  const metricasQueries = useQueries({
    queries: [
      {
        queryKey: ["total_requisicoes"],
        queryFn: async function () {
          return await fetchDados(API_CONFIG.ENDPOINTS.TOTAL_REQUISICOES);
        },
      },
      {
        queryKey: ["tempo_medio_resposta"],
        queryFn: async function () {
          return await fetchDados(API_CONFIG.ENDPOINTS.TEMPO_MEDIO_RESPOSTA);
        },
      },
      {
        queryKey: ["taxa_sucesso"],
        queryFn: async function () {
          return await fetchDados(API_CONFIG.ENDPOINTS.TAXA_SUCESSO);
        },
      },
      {
        queryKey: ["taxa_erro"],
        queryFn: async function () {
          return await fetchDados(API_CONFIG.ENDPOINTS.TAXA_ERRO);
        },
      },
    ],
  });

  const metrics = [
    {
      title: "Total de Requisições",
      value: metricasQueries[0].isLoading
        ? "Carregando..."
        : metricasQueries[0].isError
        ? 0
        : metricasQueries[0].data?.total_requisicoes,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "T. Médio de Resposta",
      value: metricasQueries[1].isLoading
        ? "Carregando..."
        : metricasQueries[1].isError
        ? "0ms"
        : `${Math.round(metricasQueries[1].data?.tempo_medio_resposta)} ms`,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Taxa de Sucesso",
      value: metricasQueries[2].isLoading
        ? "Carregando..."
        : metricasQueries[2].isError
        ? "0%"
        : `${metricasQueries[2].data?.taxa_sucesso?.toFixed(2)}%`,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Taxa de Erro",
      value: metricasQueries[3].isLoading
        ? "Carregando..."
        : metricasQueries[3].isError
        ? "0%"
        : `${metricasQueries[3].data?.taxa_erro?.toFixed(2)}%`,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const icons = [FaArrowsRotate, FaGaugeHigh, FaCheck, FaTriangleExclamation];

  return (
    <ul className="grid grid-cols-4 gap-4">
      {metrics.map(({ title, value, iconBgColor, iconColor }, index) => (
        <MetricaCard
          key={uuidv4()}
          title={title}
          value={value}
          iconBgColor={iconBgColor}
          iconColor={iconColor}
        >
          {icons[index] && React.createElement(icons[index])}
        </MetricaCard>
      ))}
    </ul>
  );
}

MetricasGrid.displayName = "MetricasGrid";
