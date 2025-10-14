import { v4 as uuidv4 } from "uuid";
import { Card } from "@/app/components/Card";

export function RecentRequestsLog() {
  const requests = [
    {
      ip: "192.168.1.1",
      verb: "GET",
      endpoint: "/api/users",
      status: 200,
      timestamp: "13/10/2025 09:45:01",
      duration: "85ms",
    },
    {
      ip: "10.0.0.5",
      verb: "POST",
      endpoint: "/api/login",
      status: 401,
      timestamp: "13/10/2025 09:44:58",
      duration: "150ms",
    },
    {
      ip: "172.16.0.10",
      verb: "GET",
      endpoint: "/api/products",
      status: 200,
      timestamp: "13/10/2025 09:44:55",
      duration: "210ms",
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold">Log de Requisições Recentes</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <th className="py-2">IP</th>
              <th className="py-2">Verbo</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Status</th>
              <th className="py-2">Data/Hora</th>
              <th className="py-2">Duração</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(
              ({ ip, verb, endpoint, status, timestamp, duration }) => (
                <tr
                  key={uuidv4()}
                  className="text-sm border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
                >
                  <td className="py-2">{ip}</td>
                  <td className="py-2">{verb}</td>
                  <td className="py-2">{endpoint}</td>
                  <td className="py-2">{status}</td>
                  <td className="py-2">{timestamp}</td>
                  <td className="py-2">{duration}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

RecentRequestsLog.displayName = "RecentRequestsLog";
