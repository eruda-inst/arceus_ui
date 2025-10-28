import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { usePrefersColorScheme } from "@/hooks/usePrefersColorScheme";

interface BarChartProps<T = any> {
  data: T[];
  xKey: keyof T | string;
  yKey: keyof T | string;
  barName?: string;
  barSize?: number;
  height?: number;
  fill?: string;
  activeBarColor?: string;
  yAxisFormatter?: (value: any) => string | number;
}

export function BarChartComponent<T = any>({
  data,
  xKey,
  yKey,
  barName,
  barSize = 18,
  height = 240,
  fill = "#60a5fa",
  activeBarColor = "#faad60",
  yAxisFormatter,
}: BarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={String(xKey)} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={yAxisFormatter as any} />
        <Tooltip
          contentStyle={{
            backgroundColor:
              usePrefersColorScheme() === "dark"
                ? "var(--bg-dark)"
                : "var(--bg-light)",
            borderColor:
              usePrefersColorScheme() === "dark"
                ? "var(--border-dark)"
                : "var(--border-light)",
            borderRadius: "8px",
            padding: "16px",
          }}
          cursor={{
            fill:
              usePrefersColorScheme() === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(25, 25, 25, 0.1)",
          }}
        />
        <Legend />
        <Bar
          dataKey={String(yKey)}
          name={barName}
          barSize={barSize}
          fill={fill}
          isAnimationActive={false}
          activeBar={{ fill: activeBarColor }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

BarChartComponent.displayName = "BarChartComponent";
