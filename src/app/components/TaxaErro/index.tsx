import { isValidElement } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { formatarPorcentagem } from "@/utils/helpers/formatar";
import { useWebSocket } from "@/hooks/useWebSocket";
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
  } = useWebSocket<TaxaErroGeralLog>(API_CONFIG.WS_ENDPOINTS.TAXA_ERRO);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useWebSocket<TaxaErroHojeLog>(API_CONFIG.WS_ENDPOINTS.TAXA_ERRO_HOJE);

  const taxaErroGeral = isLoadingGeral ? (
    <FetchingLoadingMensagem />
  ) : isErrorGeral ? (
    <FetchingMensagemErro />
  ) : typeof dataGeral?.taxa_erro === "number" ? (
    formatarPorcentagem(dataGeral.taxa_erro)
  ) : (
    "N/A"
  );

  const taxaErroHoje = isLoadingHoje ? (
    <FetchingLoadingMensagem />
  ) : isErrorHoje ? (
    <FetchingMensagemErro />
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
