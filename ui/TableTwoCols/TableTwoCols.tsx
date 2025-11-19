import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { obterCorMetodo } from "@/helpers/obterCor";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { useChavesEstaveis } from "@/hooks/useChavesEstaveis";
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
import { Spinner } from "@/components/ui/spinner";

interface EndpointData {
  metodo_http: string;
  endpoint: string;
  total_requisicoes?: number;
  total_erros?: number;
}

interface EndpointsResponse<T> {
  data: T[];
}

interface TableTwoColsProps {
  title: string;
  websocketEndpoint: string;
  dataKey: string;
}

export function TableTwoCols({
  title,
  websocketEndpoint,
  dataKey,
}: TableTwoColsProps) {
  const { data, isLoading, isError } =
    useReactWebSocket<EndpointsResponse<EndpointData>>(websocketEndpoint);

  const endpointsData = data?.[dataKey as keyof typeof data] as EndpointData[];
  const chavesEstaveis = useChavesEstaveis(endpointsData?.length || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
                <TableCell colSpan={3}>
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Mensagem className="text-destructive">Erro</Mensagem>
                </TableCell>
              </TableRow>
            ) : (
              endpointsData?.map((item: EndpointData, indice: number) => (
                <TableRow key={chavesEstaveis[indice]}>
                  <TableCell>
                    <Badge
                      className={`${Object.values(
                        obterCorMetodo(item.metodo_http)
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
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

TableTwoCols.displayName = "TableTwoCols";
