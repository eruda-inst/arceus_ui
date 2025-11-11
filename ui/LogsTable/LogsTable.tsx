import { v4 as uuidv4 } from "uuid";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { formatarData } from "@/helpers/formatar";
import { converterTempo } from "@/helpers/converter";
import { obterCorMetodo, obterCorStatusCode } from "@/helpers/obterCor";
import { Log } from "@/types/log";
import { Badge } from "@/components/ui/badge";
import { Log as LogType } from "@/types/log";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogsTableProps {
  logs: Log[];
}

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Duração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log: LogType) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

LogsTable.displayName = "LogsTable";
