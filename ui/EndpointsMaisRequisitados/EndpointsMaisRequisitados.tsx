import { useState } from "react";
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

export function EndpointsMaisRequisitados() {
  const [endpointsMaisRequisitados, setEndpointsMaisRequisitados] = useState(
    [],
  );
  const chavesEstaveis = useChavesEstaveis(
    endpointsMaisRequisitados?.length || 0,
  );

  const { isConnected, isLoading, sendMetricaRequest } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.top_endpoints !== undefined) {
        setEndpointsMaisRequisitados(data.top_endpoints);
      }
    },
    onOpen: () => {
      sendMetricaRequest("top_endpoints");
    },
    autoConnect: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints Mais Requisitados (todo o período)</CardTitle>
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
            {isConnected && !isLoading ? (
              endpointsMaisRequisitados?.map((item: any, indice: number) => (
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

EndpointsMaisRequisitados.displayName = "EndpointsMaisRequisitados";
