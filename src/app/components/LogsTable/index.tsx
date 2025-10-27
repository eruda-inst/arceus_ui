import { Pill } from "@/app/components/Pill";
import { Td } from "@/app/components/LogsTable/Td";
import { Th } from "@/app/components/LogsTable/Th";
import { formatarData } from "@/utils/helpers/formatar";
import { converterTempo } from "@/utils/helpers/converter";
import { obterCorMetodo, obterCorStatusCode } from "@/utils/helpers/obterCor";

interface Log {
  id: number;
  ip: string;
  http_method: string;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

interface LogsTableProps {
  logs: Log[];
}

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="bg-bg-light dark:bg-bg-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <Th>IP</Th>
              <Th>Método</Th>
              <Th>Endpoint</Th>
              <Th>Status</Th>
              <Th>Data</Th>
              <Th>Hora</Th>
              <Th>Duração</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Td className="text-sm font-mono">{log.ip}</Td>
                <Td>
                  <Pill className={obterCorMetodo(log.http_method)}>
                    {log.http_method}
                  </Pill>
                </Td>
                <Td className="text-sm font-mono">{log.endpoint}</Td>
                <Td>
                  <Pill className={obterCorStatusCode(log.status_code)}>
                    {log.status_code}
                  </Pill>
                </Td>
                <Td className="text-sm">{formatarData(log.data)}</Td>
                <Td className="text-sm">{log.hora.slice(0, 5)}</Td>
                <Td className="text-sm">{converterTempo(log.duracao)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8">
          <div>Nenhum log encontrado</div>
        </div>
      )}
    </div>
  );
}

LogsTable.displayName = "LogsTable";
