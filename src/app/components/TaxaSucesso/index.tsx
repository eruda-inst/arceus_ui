import { isValidElement } from "react";
import { FaCheck } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";

interface TaxaSucessoLog {
  taxa_sucesso: number;
}

export function TaxaSucesso() {
  const { data, isLoading, isError } = useWebSocket<TaxaSucessoLog>(
    API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO
  );

  const taxaSucesso = {
    id: "taxa-sucesso",
    title: "Taxa de Sucesso",
    value: isLoading ? (
      <FetchingLoadingMensagem />
    ) : isError ? (
      <FetchingMensagemErro />
    ) : typeof data?.taxa_sucesso === "number" ? (
      `${String(data.taxa_sucesso.toFixed(2)).replace(".", ",")}%`
    ) : (
      "N/A"
    ),
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  };

  return (
    <MetricCard
      key={taxaSucesso.id}
      title={taxaSucesso.title}
      value={
        isValidElement(taxaSucesso.value)
          ? taxaSucesso.value
          : String(taxaSucesso.value)
      }
      iconBgColor={taxaSucesso.iconBgColor}
      iconColor={taxaSucesso.iconColor}
    >
      <FaCheck />
    </MetricCard>
  );
}

TaxaSucesso.displayName = "TaxaSucesso";
