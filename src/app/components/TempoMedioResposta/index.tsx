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

interface TempoMedioRespostaHojeLog {
  tempo_medio_resposta_hoje: number;
}

export function TempoMedioResposta() {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useWebSocket<TempoMedioRespostaLog>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA
  );

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useWebSocket<TempoMedioRespostaHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA_HOJE
  );

  return (
    <MetricCard
      title="Tempo Médio de Resposta"
      valueGeral={
        isLoadingGeral ? (
          <FetchingLoadingMensagem />
        ) : isErrorGeral ? (
          <FetchingMensagemErro />
        ) : typeof dataGeral?.tempo_medio_resposta === "number" ? (
          converterTempo(dataGeral.tempo_medio_resposta)
        ) : (
          "N/A"
        )
      }
      valueHoje={
        isLoadingHoje ? (
          <FetchingLoadingMensagem />
        ) : isErrorHoje ? (
          <FetchingMensagemErro />
        ) : typeof dataHoje?.tempo_medio_resposta_hoje === "number" ? (
          converterTempo(dataHoje.tempo_medio_resposta_hoje)
        ) : (
          "N/A"
        )
      }
      iconBgColor="bg-purple-100"
      iconColor="text-purple-600"
    >
      <FaGaugeHigh width={16} />
    </MetricCard>
  );
}

TempoMedioResposta.displayName = "TempoMedioResposta";
