import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { MetricCard } from "@/ui/MetricCard/MetricCard";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { formatarPorcentagem } from "@/helpers/formatar";
import { API_CONFIG } from "@/config/config";

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
  } = useReactWebSocket<TaxaSucessoLog>(API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<TaxaSucessoHojeLog>(
    API_CONFIG.WS_ENDPOINTS.TAXA_SUCESSO_HOJE
  );

  const taxaSucessoGeral = isLoadingGeral ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorGeral ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataGeral?.taxa_sucesso === "number" ? (
    formatarPorcentagem(dataGeral.taxa_sucesso)
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  const taxaSucessoHoje = isLoadingHoje ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorHoje ? (
    <Mensagem className="text-destructive mt-0">Erro</Mensagem>
  ) : typeof dataHoje?.taxa_sucesso_hoje === "number" ? (
    formatarPorcentagem(dataHoje.taxa_sucesso_hoje)
  ) : (
    <Mensagem className="text-destructive mt-0">N/A</Mensagem>
  );

  return (
    <MetricCard
      title="Taxa de Sucesso"
      valueGeral={taxaSucessoGeral}
      valueHoje={taxaSucessoHoje}
    />
  );
}

TaxaSucesso.displayName = "TaxaSucesso";
