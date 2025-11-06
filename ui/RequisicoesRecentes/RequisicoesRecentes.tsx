import { v4 as uuidv4 } from "uuid";
import { API_CONFIG } from "@/config/config";
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

interface RequisicoesRecentesOut {
  requisicoes_recentes: LogType[];
}

export function RequisicoesRecentes() {
  const { data, isError, isLoading } =
    useReactWebSocket<RequisicoesRecentesOut>(
      API_CONFIG.WS_ENDPOINTS.REQUISICOES_RECENTES
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints Mais Acessados (todo o período)</CardTitle>
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
                  <Mensagem>Caregando...</Mensagem>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell>
                  <Mensagem className="text-destructive">Erro</Mensagem>
                </TableCell>
              </TableRow>
            ) : data?.requisicoes_recentes?.length === 0 ? (
              <TableRow>
                <TableCell>
                  <Mensagem className="text-destructive">N/A</Mensagem>
                </TableCell>
              </TableRow>
            ) : (
              data?.requisicoes_recentes?.map((log: LogType) => (
                <TableRow key={uuidv4()}>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorMetodo(log.http_method)
                      ).join(" ")}`}
                    >
                      {log.http_method}
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

RequisicoesRecentes.displayName = "RequisicoesRecentes";
