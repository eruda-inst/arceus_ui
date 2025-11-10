import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { BarChartComponent } from "@/ui/BarChartComponent/BarChartComponent";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Spinner } from "@/components/ui/spinner";

interface GraficoBarraProps {
  endpoint: string;
  cardTitle: string;
  transformData: (data: any | null | undefined) => any[];
  xKey: string;
  yKey: string;
  barSize?: number;
  fill?: string;
  activeBarColor?: string;
  emptyMessage?: string;
  labelText?: string;
}

export function GraficoBarra({
  endpoint,
  cardTitle,
  transformData,
  xKey,
  yKey,
  barSize = 60,
  fill = "var(--chart-2)",
  activeBarColor = "var(--chart-2)",
  labelText = "Total",
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
          <Spinner />
        ) : isError ? (
          <Mensagem className="text-destructive">Erro</Mensagem>
        ) : (
          <BarChartComponent
            data={transformedData}
            xKey={xKey}
            yKey={yKey}
            barSize={barSize}
            fill={fill}
            activeBarColor={activeBarColor}
            labelText={labelText}
          />
        )}
      </CardContent>
    </Card>
  );
}

GraficoBarra.displayName = "GraficoBarra";
