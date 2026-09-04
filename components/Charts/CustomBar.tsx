import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Skeleton } from "@heroui/react";

interface ChartBarProps {
  data?: Record<string, number | string | boolean>[];
  label: string;
  name?: string;
  description: string;
  dataKey: string;
  barDataKey?: string;
  barColor?: string;
  activeBarColor?: string;
  isLoading?: boolean;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  layout?: "vertical" | "horizontal";
}

function VerticalBarChart({
  data = [],
  label,
  name = "Total de requisições",
  description,
  dataKey,
  barDataKey = "total_requisicoes",
  barColor = "#0ea5e9",
  activeBarColor = "#f15a16",
  isLoading = false,
  hideXAxis = false,
  hideYAxis = false,
  layout = "vertical",
}: ChartBarProps) {
  const rechartsLayout = layout === "vertical" ? "horizontal" : "vertical";
  const isVertical = layout === "vertical";

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : (
        <Card className="border bg-surface min-h-80">
          <Card.Header className="space-y-3">
            <Card.Title className="text-lg font-bold">{label}</Card.Title>
            <Card.Description>{description}</Card.Description>
          </Card.Header>

          <Card.Content>
            {data && data.length > 0 ? (
              <BarChart
                layout={rechartsLayout}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  maxHeight: "500px",
                  aspectRatio: 1.618,
                }}
                responsive
                data={data}
                margin={{ top: 50, right: 5, left: 5 }}
              >
                <XAxis
                  type={isVertical ? "category" : "number"}
                  dataKey={isVertical ? dataKey : undefined}
                  hide={hideXAxis}
                  width="auto"
                />
                <YAxis
                  type={isVertical ? "number" : "category"}
                  dataKey={isVertical ? undefined : dataKey}
                  hide={hideYAxis}
                  width="auto"
                />
                <Tooltip
                  itemStyle={{}}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    borderRadius: "5px",
                    color: "#f9fafb",
                  }}
                  labelStyle={{}}
                  wrapperStyle={{ borderRadius: "10px" }}
                  separator=": "
                  cursor={{
                    fillOpacity: 0.5,
                    fill: barColor,
                  }}
                />
                <Bar
                  dataKey={barDataKey}
                  fill={barColor}
                  activeBar={{ fill: activeBarColor }}
                  label={{
                    position: isVertical ? "top" : "right",
                    fontSize: 12,
                  }}
                  radius={isVertical ? [5, 5, 0, 0] : [0, 5, 5, 0]}
                  maxBarSize={75}
                  name={name}
                />
              </BarChart>
            ) : (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                Sem dados disponíveis.
              </p>
            )}
          </Card.Content>
        </Card>
      )}
    </>
  );
}

export default VerticalBarChart;
