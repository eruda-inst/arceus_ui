"use client";

import { motion } from "framer-motion";
import { hoverAnimation } from "@/utils/animations/hover";

interface ChartCardProps {
  title: string;
}

export function ChartCard({ title }: ChartCardProps) {
  return (
    <motion.div
      {...hoverAnimation}
      className="p-4 flex flex-col justify-between bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg shadow-md border border-[var(--border-light)] dark:border-[var(--border-dark)]"
    >
      <h3 className="font-medium">{title}</h3>
      <div className="h-80">
        <div className="flex items-center justify-center h-full text-green-500">
          <div className="text-center">
            <i className="fas fa-check-circle text-4xl mb-2"></i>
            <p>Gráfico de {title} Carregado</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

ChartCard.displayName = "ChartCard";
