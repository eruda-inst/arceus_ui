import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { MetricCard } from "@/ui/MetricCard/MetricCard";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";
import { ReactNode } from "react";

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
  } = useReactWebSocket<TotalRequisicoesLog>(
    API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES
  );

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<TotalRequisicoesHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TOTAL_REQUISICOES_HOJE
  );

  const totalRequisicoesGeral: ReactNode = isLoadingGeral ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorGeral ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataGeral?.total_requisicoes === "number" ? (
    dataGeral.total_requisicoes
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  const totalRequisicoesHoje: ReactNode = isLoadingHoje ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorHoje ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataHoje?.total_requisicoes_hoje === "number" ? (
    dataHoje.total_requisicoes_hoje
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  return (
    <MetricCard
      title="Total de Requisições"
      valueGeral={totalRequisicoesGeral}
      valueHoje={totalRequisicoesHoje}
    />
  );
}

TotalRequisicoes.displayName = "TotalRequisicoes";
