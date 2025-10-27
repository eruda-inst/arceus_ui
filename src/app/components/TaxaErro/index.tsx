import { isValidElement } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";

interface TaxaErroLog {
  taxa_erro: number;
}

export function TaxaErro() {
  const { data, isLoading, isError } = useWebSocket<TaxaErroLog>(
    API_CONFIG.WS_ENDPOINTS.TAXA_ERRO
  );

  const taxaErro = {
    id: "taxa-erro",
    title: "Taxa de Erro",
    value: isLoading ? (
      <FetchingLoadingMensagem />
    ) : isError ? (
      <FetchingMensagemErro />
    ) : typeof data?.taxa_erro === "number" ? (
      `${String(data.taxa_erro.toFixed(2)).replace(".", ",")}%`
    ) : (
      "N/A"
    ),
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
  };

  return (
    <MetricCard
      key={taxaErro.id}
      title={taxaErro.title}
      valueGeral={
        isValidElement(taxaErro.value) ? taxaErro.value : String(taxaErro.value)
      }
      valueHoje={"0,00%"}
      iconBgColor={taxaErro.iconBgColor}
      iconColor={taxaErro.iconColor}
    >
      <FaTriangleExclamation width={16} />
    </MetricCard>
  );
}

TaxaErro.displayName = "TaxaErro";
