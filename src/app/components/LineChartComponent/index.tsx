import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { usePrefersColorScheme } from "@/hooks/usePrefersColorScheme";

interface LineChartProps<T = any> {
  data: T[];
  xKey: keyof T | string;
  yKey: keyof T | string;
  lineName?: string;
  height?: number;
  showDots?: boolean;
  stroke?: string;
  yAxisFormatter?: (value: any) => string | number;
}

export function LineChartComponent<T = any>({
  data,
  xKey,
  yKey,
  lineName,
  height = 240,
  showDots = false,
  stroke = "#34d399",
  yAxisFormatter,
}: LineChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={String(xKey)} />
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
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={String(yKey)}
          name={lineName}
          strokeWidth={2}
          dot={showDots}
          isAnimationActive={false}
          stroke={stroke}
          activeDot={{
            fill: "#d3346e",
            stroke: "#d3346e",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

LineChartComponent.displayName = "LineChartComponent";
