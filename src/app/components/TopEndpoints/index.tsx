"use client";

import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { hoverAnimation } from "@/utils/animations/hover";

export function TopEndpoints() {
  const endpoints = [
    { method: "GET", endpoint: "/api/users", total: "15,234" },
    { method: "POST", endpoint: "/api/orders", total: "8,765" },
    { method: "GET", endpoint: "/api/products/123", total: "5,432" },
  ];

  return (
    <motion.div
      {...hoverAnimation}
      className="p-4 flex flex-col justify-between bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg shadow-md col-span-2 border border-[var(--border-light)] dark:border-[var(--border-dark)] flex-1"
    >
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
    </motion.div>
  );
}

TopEndpoints.displayName = "TopEndpoints";
