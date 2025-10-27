import { v4 as uuidv4 } from "uuid";
import { Pill } from "@/app/components/Pill";
import { converterTempo } from "@/utils/helpers/converter";
import { obterCorMetodo, obterCorStatusCode } from "@/utils/helpers/obterCor";
import { formatarData } from "@/utils/helpers/formatar";
import { Log as LogType } from "@/utils/type/log";

interface LogProps {
  data: LogType[] | undefined;
}

export function Log({ data }: LogProps) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-xs font-medium text-gray-500 border-b border-border-light dark:border-border-dark">
          <th className="py-3">IP</th>
          <th className="py-3">Verbo</th>
          <th className="py-3">Endpoint</th>
          <th className="py-3">Status</th>
          <th className="py-3">Data</th>
          <th className="py-3">Hora</th>
          <th className="py-3">Duração</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((log: LogType) => (
          <tr
            key={uuidv4()}
            className="text-sm border-b border-border-light dark:border-border-dark"
          >
            <td className="py-3">{log.ip}</td>
            <td>
              <Pill className={obterCorMetodo(log.http_method)}>
                {log.http_method}
              </Pill>
            </td>
            <td className="py-3">{log.endpoint}</td>
            <td>
              <Pill className={obterCorStatusCode(log.status_code)}>
                {log.status_code}
              </Pill>
            </td>
            <td className="py-3">{formatarData(log.data)}</td>
            <td className="py-3">{log.hora.slice(0, 5)}</td>
            <td className="py-3">{converterTempo(log.duracao)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Log.displayName = "Log";
