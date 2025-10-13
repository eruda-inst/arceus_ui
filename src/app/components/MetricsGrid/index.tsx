import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FaArrowsRotate,
  FaGaugeHigh,
  FaCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { MetricCard } from "@/app/components/MetricCard";

export function MetricsGrid() {
  const metrics = [
    {
      title: "Total de Requisições",
      value: "12,458",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "T. Médio de Resposta",
      value: "142ms",
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Taxa de Sucesso",
      value: "97.6%",
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Taxa de Erro",
      value: "2.4%",
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const icons = [FaArrowsRotate, FaGaugeHigh, FaCheck, FaTriangleExclamation];

  return (
    <ul className="grid grid-cols-4 gap-4">
      {metrics.map(({ title, value, iconBgColor, iconColor }, index) => (
        <MetricCard
          key={uuidv4()}
          title={title}
          value={value}
          iconBgColor={iconBgColor}
          iconColor={iconColor}
        >
          {icons[index] && React.createElement(icons[index])}
        </MetricCard>
      ))}
    </ul>
  );
}

MetricsGrid.displayName = "MetricsGrid";
