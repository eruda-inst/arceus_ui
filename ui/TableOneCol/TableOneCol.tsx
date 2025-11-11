import { v4 as uuidv4 } from "uuid";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Log as LogType } from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { converterTempo } from "@/helpers/converter";
import { formatarData } from "@/helpers/formatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mensagem } from "../Mensagem/Mensagem";
import { Badge } from "@/components/ui/badge";
import { obterCorMetodo, obterCorStatusCode } from "@/helpers/obterCor";
import { Spinner } from "@/components/ui/spinner";

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

  const logs = data?.[dataKey] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP</TableHead>
              <TableHead>Verbo</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Duração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell>
                  <Mensagem className="text-destructive">Erro</Mensagem>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: LogType) => (
                <TableRow key={uuidv4()}>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorMetodo(log.metodo_http)
                      ).join(" ")}`}
                    >
                      {log.metodo_http}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.endpoint}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorStatusCode(log.status_code)
                      ).join(" ")}`}
                    >
                      {log.status_code}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatarData(log.data)}</TableCell>
                  <TableCell>{log.hora.slice(0, 5)}</TableCell>
                  <TableCell>{converterTempo(log.duracao)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

TableOneCol.displayName = "TableOneCol";
