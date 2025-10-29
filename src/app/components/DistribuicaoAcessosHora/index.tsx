import { Card } from "@/app/components/Card";
import { Mensagem } from "@/app/components/Mensagem";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/utils/config";

interface DistribuicaoAcessosHoraData {
  [key: string]: number;
}

interface DistribuicaoAcessosHoraOut {
  distribuicao_acessos_hora: DistribuicaoAcessosHoraData;
}

interface DistribuicaoAcessosHoraTransformed {
  hora: string;
  acessos: number;
}

export function DistribuicaoAcessosHora() {
  const { data, isLoading, isError } =
    useReactWebSocket<DistribuicaoAcessosHoraOut>(
      API_CONFIG.WS_ENDPOINTS.DISTRIBUICAO_ACESSOS_HORA // Altere o endpoint conforme necessário
    );

  function transformDistribuicaoAcessosHora(
    data: DistribuicaoAcessosHoraOut | null | undefined
  ): DistribuicaoAcessosHoraTransformed[] {
    if (!data || !data.distribuicao_acessos_hora) {
      return [];
    }

    const acessosPorHora = data.distribuicao_acessos_hora;
    const transformedData: DistribuicaoAcessosHoraTransformed[] = [];

    Object.keys(acessosPorHora).forEach((hora) => {
      const acessos = acessosPorHora[hora];

      if (acessos > 0) {
        const horaFormatada = `${hora}:00`;

        transformedData.push({
          hora: horaFormatada,
          acessos: acessos,
        });
      }
    });

    transformedData.sort((a, b) => {
      const horaA = parseInt(a.hora.split(":")[0]);
      const horaB = parseInt(b.hora.split(":")[0]);
      return horaA - horaB;
    });

    return transformedData;
  }

  const distribuicaoTransformada = transformDistribuicaoAcessosHora(data);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Distribuição de Acessos por Hora
      </h3>
      {isLoading ? (
        <Mensagem>Carregando...</Mensagem>
      ) : isError ? (
        <Mensagem className="text-red-500">Erro</Mensagem>
      ) : distribuicaoTransformada.length === 0 ? (
        "N/A"
      ) : (
        <BarChartComponent
          data={distribuicaoTransformada}
          xKey="hora"
          yKey="acessos"
          barName="Número de Acessos"
          fill="#007BFF"
          activeBarColor="#FF8400"
        />
      )}
    </Card>
  );
}

DistribuicaoAcessosHora.displayName = "DistribuicaoAcessosHora";
