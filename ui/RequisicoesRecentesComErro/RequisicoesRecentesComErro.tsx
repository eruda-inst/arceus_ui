import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { useChavesEstaveis } from "@/hooks/useChavesEstaveis";
import { formatarData, formatarTempo } from "@/helpers/formatar";
import { obterCorMetodo, obterCorStatusCode } from "@/helpers/obterCor";
import { Log } from "@/types/log";
import { useAuth } from "@/hooks/useAuth";

export function RequisicoesRecentesComErro() {
  const { hasPermission } = useAuth();
  const [registros, setRegistros] = useState([]);
  const chavesEstaveis = useChavesEstaveis(registros?.length || 0);

  const { isConnected, isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.requisicoes_recentes_erro !== undefined) {
        setRegistros(data.requisicoes_recentes_erro);
      }
    },
    onOpen: () => {
      sendMetricaRequest("requisicoes_recentes_erro");
    },
    autoConnect: true,
  });

  if (!hasPermission("registros:ver")) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requisições Recentes com Erro (todo o período)</CardTitle>
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
              <TableHead>Protocolo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isConnected && !isLoading ? (
              registros.map((registro: Log, indice: number) => (
                <TableRow key={chavesEstaveis[indice]}>
                  <TableCell>{registro.ip}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorMetodo(registro.metodo_http),
                      ).join(" ")}`}
                    >
                      {registro.metodo_http}
                    </Badge>
                  </TableCell>
                  <TableCell>{registro.endpoint}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorStatusCode(registro.status_code),
                      ).join(" ")}`}
                    >
                      {registro.status_code}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatarData(registro.data)}</TableCell>
                  <TableCell>{registro.hora.slice(0, 5)}</TableCell>
                  <TableCell>{formatarTempo(registro.duracao)}</TableCell>
                  <TableCell>{registro.protocolo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <Spinner />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
