import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mensagem } from "@/ui/Mensagem/Mensagem";
import { Badge } from "@/components/ui/badge";
import { obterCorMetodo, obterCorStatusCode } from "@/helpers/obterCor";
import { formatarData, formatarTempo } from "@/helpers/formatar";
import { Spinner } from "@/components/ui/spinner";
import { useChavesEstaveis } from "@/hooks/useChavesEstaveis";
import { Log } from "@/types/log";

interface TabelaCompletaProps {
  isError?: boolean;
  isLoading?: boolean;
  registros: Log[];
}

export function TabelaCompleta({
  isError = undefined,
  isLoading = undefined,
  registros,
}: TabelaCompletaProps) {
  const chavesEstaveis = useChavesEstaveis(registros.length || 0);

  return (
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
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Spinner />
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Mensagem className="text-destructive">Erro</Mensagem>
            </TableCell>
          </TableRow>
        ) : (
          registros.map((registro: Log, indice: number) => (
            <TableRow key={chavesEstaveis[indice]}>
              <TableCell>{registro.ip}</TableCell>
              <TableCell>
                <Badge
                  className={`${Object.values(
                    obterCorMetodo(registro.metodo_http)
                  ).join(" ")}`}
                >
                  {registro.metodo_http}
                </Badge>
              </TableCell>
              <TableCell>{registro.endpoint}</TableCell>
              <TableCell>
                <Badge
                  className={`${Object.values(
                    obterCorStatusCode(registro.status_code)
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
        )}
      </TableBody>
    </Table>
  );
}
