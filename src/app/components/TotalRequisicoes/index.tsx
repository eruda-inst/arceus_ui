import { FaArrowsRotate } from "react-icons/fa6";
import { Mensagem } from "@/app/components/Mensagem";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";

interface TotalRequisicoesLog {
  total_requisicoes: number;
}

interface TotalRequisicoesHojeLog {
  total_requisicoes_hoje: number;
}

export function TotalRequisicoes() {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useWebSocket<TotalRequisicoesLog>(
    API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES
  );

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useWebSocket<TotalRequisicoesHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES_HOJE
  );

  return (
    <MetricCard
      title="Total de Requisições"
      valueGeral={
        isLoadingGeral ? (
          <Mensagem className="mt-0">Carregando...</Mensagem>
        ) : isErrorGeral ? (
          <Mensagem className="text-red-500 mt-0">Erro</Mensagem>
        ) : typeof dataGeral?.total_requisicoes === "number" ? (
          dataGeral.total_requisicoes
        ) : (
          "N/A"
        )
      }
      valueHoje={
        isLoadingHoje ? (
          <Mensagem className="mt-0">Carregando...</Mensagem>
        ) : isErrorHoje ? (
          <Mensagem className="text-red-500 mt-0">Erro</Mensagem>
        ) : typeof dataHoje?.total_requisicoes_hoje === "number" ? (
          dataHoje.total_requisicoes_hoje
        ) : (
          "N/A"
        )
      }
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
    >
      <FaArrowsRotate width={16} />
    </MetricCard>
  );
}

TotalRequisicoes.displayName = "TotalRequisicoes";
