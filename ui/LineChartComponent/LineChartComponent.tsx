import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface LineChartProps<T> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  lineName?: string;
  showDots?: boolean;
  stroke?: string;
  activeDot?: {
    fill: string;
    stroke: string;
  };
  yAxisFormatter?: (value: number) => string;
}

export function LineChartComponent<T>({
  data,
  xKey,
  yKey,
  lineName = "Valor",
  showDots = true,
  stroke = "var(--chart-1)",
  activeDot = {
    fill: "var(--chart-1)",
    stroke: "var(--chart-1)",
  },
  yAxisFormatter,
}: LineChartProps<T>) {
  const chartConfig = {
    [yKey as string]: {
      label: lineName,
      color: stroke,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey as string}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value}
        />
        <YAxis
          dataKey={yKey as string}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tickFormatter={
            yAxisFormatter ?? ((value: number) => value.toString())
          }
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey={yKey as string}
          stroke={stroke}
          strokeWidth={2}
          dot={showDots ? { r: 4, fill: stroke } : false}
          activeDot={{
            r: 6,
            fill: activeDot.fill,
            stroke: activeDot.stroke,
            strokeWidth: 2,
          }}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}

LineChartComponent.displayName = "LineChartComponent";
