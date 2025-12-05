import { obterCorMetodo } from "@/helpers/obterCor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChavesEstaveis } from "@/hooks/useChavesEstaveis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { useEffect, useState } from "react";

export function EndpointsComMaisErros() {
  const [endpointsComMaisErros, setEndpointsComMaisErros] = useState([]);
  const chavesEstaveis = useChavesEstaveis(endpointsComMaisErros?.length || 0);

  const { isConnected, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      // Verificar qual resposta chegou
      if (data.endpoints_com_mais_erros !== undefined) {
        setEndpointsComMaisErros(data.endpoints_com_mais_erros);
      }
    },
    onOpen: () => {
      // Solicitar métricas quando a conexão for estabelecida
      sendMetricaRequest("endpoints_com_mais_erros");
    },
    autoConnect: true,
  });

  useEffect(() => {
    if (!isConnected) return;

    const idIntervalo = setInterval(() => {
      sendMetricaRequest("endpoints_com_mais_erros");
    }, 500);

    return () => clearInterval(idIntervalo);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints com Mais Erros (todo o período)</CardTitle>
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
            {isConnected ? (
              endpointsComMaisErros?.map((item: any, indice: number) => (
                <TableRow key={chavesEstaveis[indice]}>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorMetodo(item.metodo_http),
                      ).join(" ")}`}
                    >
                      {item.metodo_http}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.endpoint}</TableCell>
                  <TableCell>
                    {item.total_requisicoes
                      ? item.total_requisicoes
                      : item.total_erros}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
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

EndpointsComMaisErros.displayName = "EndpointsComMaisErros";
