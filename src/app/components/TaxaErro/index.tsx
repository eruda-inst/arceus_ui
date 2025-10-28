import { isValidElement } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Mensagem } from "@/app/components/Mensagem";
import { MetricCard } from "@/app/components/MetricCard";
import { formatarPorcentagem } from "@/utils/helpers/formatar";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/utils/config";

interface TaxaErroGeralLog {
  taxa_erro: number;
}

interface TaxaErroHojeLog {
  taxa_erro_hoje: number;
}

export function TaxaErro() {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useReactWebSocket<TaxaErroGeralLog>(API_CONFIG.WS_ENDPOINTS.TAXA_ERRO);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<TaxaErroHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TAXA_ERRO_HOJE
  );

  const taxaErroGeral = isLoadingGeral ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorGeral ? (
    <Mensagem className="text-red-500 mt-0">Erro</Mensagem>
  ) : typeof dataGeral?.taxa_erro === "number" ? (
    formatarPorcentagem(dataGeral.taxa_erro)
  ) : (
    "N/A"
  );

  const taxaErroHoje = isLoadingHoje ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorHoje ? (
    <Mensagem className="text-red-500 mt-0">Erro</Mensagem>
  ) : typeof dataHoje?.taxa_erro_hoje === "number" ? (
    formatarPorcentagem(dataHoje.taxa_erro_hoje)
  ) : (
    "N/A"
  );

  return (
    <MetricCard
      title="Taxa de Erro"
      valueGeral={
        isValidElement(taxaErroGeral) ? taxaErroGeral : String(taxaErroGeral)
      }
      valueHoje={
        isValidElement(taxaErroHoje) ? taxaErroHoje : String(taxaErroHoje)
      }
      iconBgColor="bg-red-100"
      iconColor="text-red-600"
    >
      <FaTriangleExclamation width={16} />
    </MetricCard>
  );
}

TaxaErro.displayName = "TaxaErro";
