import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Log as LogType } from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabelaCompleta } from "@/ui/TabelaCompleta/TabelaCompleta";

interface TableOneColProps {
  websocketEndpoint: string;
  dataKey: string;
  title: string;
}

export function TableOneCol({
  websocketEndpoint,
  dataKey,
  title,
}: TableOneColProps) {
  const { data, isError, isLoading } = useReactWebSocket<{
    [key: string]: LogType[];
  }>(websocketEndpoint);

  const registros = data?.[dataKey] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TabelaCompleta
          isError={isError}
          isLoading={isLoading}
          registros={registros}
        />
      </CardContent>
    </Card>
  );
}

TableOneCol.displayName = "TableOneCol";
