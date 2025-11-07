import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";

interface GraficoBarraProps {
  endpoint: string;
  cardTitle: string;
  transformData: (data: any | null | undefined) => any[];
  xKey: string;
  yKey: string;
  barName: string;
  barSize?: number;
  fill?: string;
  activeBarColor?: string;
  emptyMessage?: string;
}

export function GraficoBarra({
  endpoint,
  cardTitle,
  transformData,
  xKey,
  yKey,
  emptyMessage = "N/A",
  barName = "Valor",
  barSize = 60,
  fill = "var(--chart-2)",
  activeBarColor = "var(--chart-2)",
}: GraficoBarraProps) {
  const { data, isLoading, isError } = useReactWebSocket<any>(endpoint);
  const transformedData = transformData(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Mensagem>Carregando...</Mensagem>
        ) : isError ? (
          <Mensagem className="text-destructive">Erro</Mensagem>
        ) : transformedData.length === 0 ? (
          <Mensagem className="text-destructive">{emptyMessage}</Mensagem>
        ) : (
          <BarChartComponent
            data={transformedData}
            xKey={xKey}
            yKey={yKey}
            barName={barName}
            barSize={barSize}
            fill={fill}
            activeBarColor={activeBarColor}
          />
        )}
      </CardContent>
    </Card>
  );
}

GraficoBarra.displayName = "GraficoBarra";