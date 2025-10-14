import { v4 as uuidv4 } from "uuid";
import { Card } from "@/app/components/Card";

export function TopEndpoints() {
  const endpoints = [
    { method: "GET", endpoint: "/api/users", total: "15,234" },
    { method: "POST", endpoint: "/api/orders", total: "8,765" },
    { method: "GET", endpoint: "/api/products/123", total: "5,432" },
  ];

  return (
    <Card className="justify-between col-span-2 flex-1">
      <h3 className="text-lg font-semibold">Endpoints Mais Acessados</h3>
      <div className="mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-500 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <th className="py-2">Verbo</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(({ method, endpoint, total }) => (
              <tr
                key={uuidv4()}
                className="text-sm border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
              >
                <td className="py-2">{method}</td>
                <td className="py-2">{endpoint}</td>
                <td className="py-2">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

TopEndpoints.displayName = "TopEndpoints";
