"use client";

import { motion } from "framer-motion";
import { LineChartComponent } from "@/app/components/LineChartComponent";
import { BarChartComponent } from "@/app/components/BarChartComponent";
import { hoverAnimation } from "@/utils/animations/hover";

export function ChartsGrid() {
  const lineData = [
    { hour: "00:00", totalRequests: 234 },
    { hour: "01:00", totalRequests: 156 },
    { hour: "02:00", totalRequests: 89 },
    { hour: "03:00", totalRequests: 67 },
    { hour: "04:00", totalRequests: 45 },
    { hour: "05:00", totalRequests: 78 },
    { hour: "06:00", totalRequests: 189 },
    { hour: "07:00", totalRequests: 456 },
    { hour: "08:00", totalRequests: 789 },
    { hour: "09:00", totalRequests: 892 },
    { hour: "10:00", totalRequests: 945 },
    { hour: "11:00", totalRequests: 876 },
    { hour: "12:00", totalRequests: 912 },
    { hour: "13:00", totalRequests: 834 },
    { hour: "14:00", totalRequests: 897 },
    { hour: "15:00", totalRequests: 923 },
    { hour: "16:00", totalRequests: 878 },
    { hour: "17:00", totalRequests: 765 },
    { hour: "18:00", totalRequests: 689 },
    { hour: "19:00", totalRequests: 723 },
    { hour: "20:00", totalRequests: 812 },
    { hour: "21:00", totalRequests: 745 },
    { hour: "22:00", totalRequests: 567 },
    { hour: "23:00", totalRequests: 389 },
  ];

  const barData = [
    { statusCode: "200", total: 854 },
    { statusCode: "201", total: 219 },
    { statusCode: "202", total: 467 },
    { statusCode: "203", total: 753 },
    { statusCode: "204", total: 391 },
    { statusCode: "205", total: 627 },
    { statusCode: "206", total: 93 },
    { statusCode: "207", total: 817 },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <motion.div
        {...hoverAnimation}
        className="bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg p-4 shadow border border-[var(--border-light)] dark:border-[var(--border-dark)]"
      >
        <h3 className="mb-2">Requisições por Hora</h3>
        <LineChartComponent
          data={lineData}
          xKey="hour"
          yKey="totalRequests"
          lineName="Número de Requisições"
          showDots={true}
        />
      </motion.div>
      <motion.div
        {...hoverAnimation}
        className="bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg p-4 shadow border border-[var(--border-light)] dark:border-[var(--border-dark)]"
      >
        <h3 className="mb-2">Distribuição de Status Codes</h3>
        <BarChartComponent
          data={barData}
          xKey="statusCode"
          yKey="total"
          barName="Número de Ocorrências"
        />
      </motion.div>
    </div>
  );
}

ChartsGrid.displayName = "ChartsGrid";
