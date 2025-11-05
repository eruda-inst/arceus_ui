import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface BarChartProps<TData> {
  data: TData[];
  xKey: keyof TData;
  yKey: keyof TData;
  barName?: string;
  barSize?: number;
  height?: number;
  fill?: string;
  activeBarColor?: string;
  yAxisFormatter?: (value: number) => string;
}

export function BarChartComponent<TData>({
  data,
  xKey,
  yKey,
  barName = "Valor",
  barSize = 60,
  fill = "var(--chart-2)",
  activeBarColor = "var(--chart-2)",
  yAxisFormatter,
}: BarChartProps<TData>) {
  const chartConfig = {
    [yKey as string]: {
      label: barName,
      color: fill,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <RechartsBarChart
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
          tickFormatter={(value) => value}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tickFormatter={yAxisFormatter ?? ((value) => value.toString())}
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey={yKey as string}
          fill={fill}
          barSize={barSize}
          radius={[4, 4, 0, 0]}
          activeBar={{
            fill: activeBarColor,
            stroke: activeBarColor,
            strokeWidth: 2,
          }}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}

BarChartComponent.displayName = "BarChartComponent";
