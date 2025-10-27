import { isValidElement } from "react";
import { FaCheck } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { formatarPorcentagem } from "@/utils/helpers/formatar";
import { API_CONFIG } from "@/utils/config";

interface TaxaSucessoLog {
  taxa_sucesso: number;
}

interface TaxaSucessoHojeLog {
  taxa_sucesso_hoje: number;
}

export function TaxaSucesso() {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useWebSocket<TaxaSucessoLog>(API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useWebSocket<TaxaSucessoHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO_HOJE
  );

  const taxaSucessoGeral = isLoadingGeral ? (
    <FetchingLoadingMensagem />
  ) : isErrorGeral ? (
    <FetchingMensagemErro />
  ) : typeof dataGeral?.taxa_sucesso === "number" ? (
    formatarPorcentagem(dataGeral.taxa_sucesso)
  ) : (
    "N/A"
  );

  const taxaSucessoHoje = isLoadingHoje ? (
    <FetchingLoadingMensagem />
  ) : isErrorHoje ? (
    <FetchingMensagemErro />
  ) : typeof dataHoje?.taxa_sucesso_hoje === "number" ? (
    formatarPorcentagem(dataHoje.taxa_sucesso_hoje)
  ) : (
    "N/A"
  );

  return (
    <MetricCard
      title="Taxa de Sucesso"
      valueGeral={
        isValidElement(taxaSucessoGeral)
          ? taxaSucessoGeral
          : String(taxaSucessoGeral)
      }
      valueHoje={
        isValidElement(taxaSucessoHoje)
          ? taxaSucessoHoje
          : String(taxaSucessoHoje)
      }
      iconBgColor="bg-green-100"
      iconColor="text-green-600"
    >
      <FaCheck width={16} />
    </MetricCard>
  );
}

TaxaSucesso.displayName = "TaxaSucesso";
