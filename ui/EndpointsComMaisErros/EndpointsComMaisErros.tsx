import { v4 as uuidv4 } from "uuid";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { obterCorMetodo } from "@/helpers/obterCor";
import { API_CONFIG } from "@/config/config";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { Log } from "@/types/log";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EndpointComMaisErrosLog
  extends Pick<Log, "http_method" | "endpoint"> {
  total_erros: number;
}

interface EndpointsComMaisErrosLogOut {
  endpoints_com_mais_erros: EndpointComMaisErrosLog[];
}

export function EndpointsComMaisErros() {
  const { data, isLoading, isError } =
    useReactWebSocket<EndpointsComMaisErrosLogOut>(
      API_CONFIG.WS_ENDPOINTS.ENDPOINTS_COM_MAIS_ERROS
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints Com mais Erros (todo o período)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Verbo</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Total</TableHead>
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
            ) : data?.endpoints_com_mais_erros?.length === 0 ? (
              <TableRow>
                <TableCell>
                  <Mensagem className="text-destructive">N/A</Mensagem>
                </TableCell>
              </TableRow>
            ) : (
              data?.endpoints_com_mais_erros?.map(
                (log: EndpointComMaisErrosLog) => (
                  <TableRow key={uuidv4()}>
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
                    <TableCell>{log.total_erros}</TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

EndpointsComMaisErros.displayName = "EndpointsComMaisErros";
