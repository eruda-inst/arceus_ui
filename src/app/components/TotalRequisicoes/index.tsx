import { FaArrowsRotate } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";

interface TotalRequisicoesLog {
  total_requisicoes: number;
}

export function TotalRequisicoes() {
  const {
    data: totalData,
    isLoading: isTotalLoading,
    isError: isTotalError,
  } = useWebSocket<TotalRequisicoesLog>(
    API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES
  );

  const totalRequisicoes = {
    id: "total-requisicoes",
    title: "Total de Requisições",
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
  };

  return (
    <MetricCard
      title={totalRequisicoes.title}
      valueGeral={totalRequisicoes.value}
      valueHoje={35}
      iconBgColor={totalRequisicoes.iconBgColor}
      iconColor={totalRequisicoes.iconColor}
    >
      <FaArrowsRotate width={16} />
    </MetricCard>
  );
}

TotalRequisicoes.displayName = "TotalRequisicoes";
