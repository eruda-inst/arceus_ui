import { Mensagem } from "@/app/components/Mensagem";
import { MetricCard } from "@/app/components/MetricCard";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";
import { converterTempo } from "@/helpers/converter";

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
  } = useReactWebSocket<TempoMedioRespostaLog>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA
  );

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<TempoMedioRespostaHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA_HOJE
  );

  const tempoMedioRespostaGeral = isLoadingGeral ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorGeral ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataGeral?.tempo_medio_resposta === "number" ? (
    converterTempo(dataGeral.tempo_medio_resposta)
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  const tempoMedioRespostaHoje = isLoadingHoje ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorHoje ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataHoje?.tempo_medio_resposta_hoje === "number" ? (
    converterTempo(dataHoje.tempo_medio_resposta_hoje)
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  return (
    <MetricCard
      title="T. Médio de Resposta"
      valueGeral={tempoMedioRespostaGeral}
      valueHoje={tempoMedioRespostaHoje}
    />
  );
}

TempoMedioResposta.displayName = "TempoMedioResposta";
