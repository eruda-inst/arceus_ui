import { v4 as uuidv4 } from "uuid";
import { Mensagem } from "@/app/components/Mensagem";
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

interface TopEndpointsLog extends Pick<Log, "http_method" | "endpoint"> {
  total_acessos: number;
}

interface TopEndpointsLogOut {
  top_endpoints: TopEndpointsLog[];
}

export function TopEndpoints() {
  const { data, isLoading, isError } = useReactWebSocket<TopEndpointsLogOut>(
    API_CONFIG.WS_ENDPOINTS.TOP_ENDPOINTS
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
            ) : data?.top_endpoints?.length === 0 ? (
              <TableRow>
                <TableCell>
                  <Mensagem className="text-destructive">N/A</Mensagem>
                </TableCell>
              </TableRow>
            ) : (
              data?.top_endpoints?.map((log: TopEndpointsLog) => (
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
                  <TableCell>{log.total_acessos}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

TopEndpoints.displayName = "TopEndpoints";
