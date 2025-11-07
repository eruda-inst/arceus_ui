import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricProps<TGeral, THoje> {
  title: string;
  endpointGeral: string;
  endpointHoje: string;
  dataKeyGeral: keyof TGeral;
  dataKeyHoje: keyof THoje;
  formatter?: (value: any) => ReactNode;
  errorClassName?: string;
}

export function Metric<TGeral, THoje>({
  title,
  endpointGeral,
  endpointHoje,
  dataKeyGeral,
  dataKeyHoje,
  formatter,
  errorClassName = "text-destructive mt-0",
}: MetricProps<TGeral, THoje>) {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useReactWebSocket<TGeral>(endpointGeral);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<THoje>(endpointHoje);

  const renderValue = (
    isLoading: boolean,
    isError: boolean,
    data: any,
    dataKey: string | number | symbol
  ): ReactNode => {
    if (isLoading) {
      return <Mensagem className="mt-0">Carregando...</Mensagem>;
    }

    if (isError) {
      return <Mensagem className={errorClassName}>Erro</Mensagem>;
    }

    const value = data?.[dataKey];

    if (typeof value !== "number" && typeof value !== "string") {
      return <Mensagem className={errorClassName}>N/A</Mensagem>;
    }

    return formatter ? formatter(value) : value;
  };

  const valueGeral = renderValue(
    isLoadingGeral,
    isErrorGeral,
    dataGeral,
    dataKeyGeral
  );
  const valueHoje = renderValue(
    isLoadingHoje,
    isErrorHoje,
    dataHoje,
    dataKeyHoje
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
            <span className="text-sm text-muted-foreground">Geral</span>
            <span className="text-xl font-bold text-muted-foreground">
              {valueGeral}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
            <span className="text-sm">Hoje</span>
            <span className="text-xl font-bold">{valueHoje}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

Metric.displayName = "Metric";
