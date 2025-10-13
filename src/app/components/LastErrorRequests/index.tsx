"use client";

import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { hoverAnimation } from "@/utils/animations/hover";

export function LastErrorRequests() {
  const errors = [
    { code: "404", endpoint: "/api/nonexistent", time: "1 min atrás" },
    { code: "500", endpoint: "/api/users", time: "5 min atrás" },
    { code: "401", endpoint: "/api/secure-data", time: "12 min atrás" },
  ];

  return (
    <motion.div
      {...hoverAnimation}
      className="p-4 flex flex-col justify-between bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg shadow-md border border-[var(--border-light)] dark:border-[var(--border-dark)]"
    >
      <h3 className="text-lg font-semibold">Últimas Requisições com Erro</h3>
      <div className="mt-4 text-sm">
        {errors.map(({ code, endpoint, time }) => (
          <div
            key={uuidv4()}
            className="flex justify-between py-2 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]"
          >
            <span>
              <strong>{code}</strong> - {endpoint}
            </span>
            <span className="text-gray-500">{time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

LastErrorRequests.displayName = "LastErrorRequests";
