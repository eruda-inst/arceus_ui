import { FaGaugeHigh } from "react-icons/fa6";
import { FetchingLoadingMensagem } from "@/app/components/FetchingLoadingMensagem";
import { FetchingMensagemErro } from "@/app/components/FetchingMensagemErro";
import { MetricCard } from "@/app/components/MetricCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";
import { converterTempo } from "@/utils/helpers/converter";

interface TempoMedioRespostaLog {
  tempo_medio_resposta: number;
}

export function TempoMedioResposta() {
  const { data, isLoading, isError } = useWebSocket<TempoMedioRespostaLog>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA
  );

  const tempoMedioResposta = {
    id: "tempo-medio-resposta",
    title: "T. Médio de Resposta",
    value: isLoading ? (
      <FetchingLoadingMensagem />
    ) : isError ? (
      <FetchingMensagemErro />
    ) : typeof data?.tempo_medio_resposta === "number" ? (
      converterTempo(data.tempo_medio_resposta).replace(".", ",")
    ) : (
      "N/A"
    ),
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  };

  return (
    <MetricCard
      title={tempoMedioResposta.title}
      value={tempoMedioResposta.value}
      iconBgColor={tempoMedioResposta.iconBgColor}
      iconColor={tempoMedioResposta.iconColor}
    >
      <FaGaugeHigh />
    </MetricCard>
  );
}

TempoMedioResposta.displayName = "TempoMedioResposta";
