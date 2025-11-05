import { Mensagem } from "@/app/components/Mensagem";
import { MetricCard } from "@/app/components/MetricCard";
import { formatarPorcentagem } from "@/helpers/formatar";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";

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
    <Mensagem className="text-red-500 mt-0">N/A</Mensagem>
  );

  const taxaErroHoje = isLoadingHoje ? (
    <Mensagem className="mt-0">Carregando...</Mensagem>
  ) : isErrorHoje ? (
    <Mensagem className="text-red-500 mt-0">Erro</Mensagem>
  ) : typeof dataHoje?.taxa_erro_hoje === "number" ? (
    formatarPorcentagem(dataHoje.taxa_erro_hoje)
  ) : (
    <Mensagem className="text-red-500 mt-0">N/A</Mensagem>
  );

  return (
    <MetricCard
      title="Taxa de Erro"
      valueGeral={taxaErroGeral}
      valueHoje={taxaErroHoje}
    />
  );
}

TaxaErro.displayName = "TaxaErro";
