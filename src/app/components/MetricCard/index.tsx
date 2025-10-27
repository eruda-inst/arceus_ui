import { ReactNode } from "react";
import { Card } from "@/app/components/Card";

interface MetricCardProps {
  title: string;
  valueGeral: string | ReactNode;
  valueHoje: string | ReactNode;
  children?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  valueGeral,
  valueHoje,
  children,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: MetricCardProps) {
  return (
    <Card className="flex-col p-6 relative justify-between">
      {/* Cabeçalho com título e ícone */}
      <div className="flex justify-between mb-4 items-center gap-y-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 max-w-[140px]">
          {title}
        </h3>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor} ${iconColor}`}
        >
          {children}
        </div>
      </div>

      {/* Valores das métricas */}
      <div className="flex flex-col">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Geral
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {valueGeral}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Hoje
            </span>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {valueHoje}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

MetricCard.displayName = "MetricCard";
