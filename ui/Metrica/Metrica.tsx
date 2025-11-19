import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";

interface MetricaProps<
  TGeral,
  THoje,
  TGeralAbsolute = any,
  THojeAbsolute = any
> {
  title: string;
  rotaGeral: string;
  rotaHoje: string;
  rotaGeralAbsolute?: string;
  rotaHojeAbsolute?: string;
  dataKeyGeral: keyof TGeral;
  dataKeyHoje: keyof THoje;
  dataKeyGeralAbsolute?: keyof TGeralAbsolute;
  dataKeyHojeAbsolute?: keyof THojeAbsolute;
  formatter?: (value: any) => ReactNode;
}

export function Metrica<
  TGeral,
  THoje,
  TGeralAbsolute = any,
  THojeAbsolute = any
>({
  title,
  rotaGeral,
  rotaHoje,
  rotaGeralAbsolute,
  rotaHojeAbsolute,
  dataKeyGeral,
  dataKeyHoje,
  dataKeyGeralAbsolute,
  dataKeyHojeAbsolute,
  formatter,
}: MetricaProps<TGeral, THoje, TGeralAbsolute, THojeAbsolute>) {
  const {
    data: dataGeral,
    isLoading: isLoadingGeral,
    isError: isErrorGeral,
  } = useReactWebSocket<TGeral>(rotaGeral);

  const {
    data: dataHoje,
    isLoading: isLoadingHoje,
    isError: isErrorHoje,
  } = useReactWebSocket<THoje>(rotaHoje);

  const {
    data: dataGeralAbsolute,
    isLoading: isLoadingGeralAbsolute,
    isError: isErrorGeralAbsolute,
  } = useReactWebSocket<TGeralAbsolute>(rotaGeralAbsolute || "");

  const {
    data: dataHojeAbsolute,
    isLoading: isLoadingHojeAbsolute,
    isError: isErrorHojeAbsolute,
  } = useReactWebSocket<THojeAbsolute>(rotaHojeAbsolute || "");

  const renderValueBlock = (
    isLoading: boolean,
    isError: boolean,
    data: any,
    mainKey: string | number | symbol,
    absoluteData: any,
    absoluteKey?: string | number | symbol,
    hasAbsoluteRoute?: boolean
  ): ReactNode => {
    if (isLoading) {
      return <Spinner />;
    }
    if (isError) {
      return <Mensagem className="text-destructive mt-0">Erro</Mensagem>;
    }
    const rawMain = data?.[mainKey as string];
    const displayMain = formatter ? formatter(rawMain) : rawMain;
    const rawAbs =
      absoluteKey && absoluteData
        ? absoluteData?.[absoluteKey as string]
        : null;

    return (
      <div className="flex gap-x-1 items-end leading-tight">
        <span>{displayMain}</span>
        {rawAbs !== null && rawAbs !== undefined && hasAbsoluteRoute && (
          <span className="text-xs font-normal opacity-70">({rawAbs})</span>
        )}
      </div>
    );
  };

  const hasGeralAbsolute = !!rotaGeralAbsolute;
  const hasHojeAbsolute = !!rotaHojeAbsolute;

  const valueGeral = renderValueBlock(
    isLoadingGeral || (hasGeralAbsolute ? isLoadingGeralAbsolute : false),
    isErrorGeral || (hasGeralAbsolute ? isErrorGeralAbsolute : false),
    dataGeral,
    dataKeyGeral,
    dataGeralAbsolute,
    dataKeyGeralAbsolute,
    hasGeralAbsolute
  );

  const valueHoje = renderValueBlock(
    isLoadingHoje || (hasHojeAbsolute ? isLoadingHojeAbsolute : false),
    isErrorHoje || (hasHojeAbsolute ? isErrorHojeAbsolute : false),
    dataHoje,
    dataKeyHoje,
    dataHojeAbsolute,
    dataKeyHojeAbsolute,
    hasHojeAbsolute
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
            <div className="text-xl font-bold text-muted-foreground flex items-center">
              {valueGeral}
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
            <span className="text-sm">Hoje</span>
            <div className="text-xl font-bold flex items-center">
              {valueHoje}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

Metrica.displayName = "Metrica";
