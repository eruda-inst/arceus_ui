"use client";

import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Skeleton } from "@heroui/react";

interface ChartBarProps {
  data: Record<string, any>[];
  label: string;
  name?: string;
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
  data,
  label,
  name = "Total de requisições",
  dataKey,
  barDataKey = "total_requisicoes",
  barColor = "#0ea5e9",
  activeBarColor = "#f15a16",
  isLoading = false,
  hideXAxis = false,
  hideYAxis = false,
  layout = "horizontal",
}: ChartBarProps) {
  return (
    <>
      {isLoading ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title className="text-lg font-bold">{label}</Card.Title>
          </Card.Header>
          <Card.Content>
            {data && data.length > 0 ? (
              <BarChart
                layout={layout}
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
                  type={layout === "vertical" ? "number" : "category"}
                  dataKey={layout === "horizontal" ? dataKey : undefined}
                  hide={hideXAxis}
                  width="auto"
                />
                <YAxis
                  type={layout === "vertical" ? "category" : "number"}
                  dataKey={layout === "vertical" ? dataKey : undefined}
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
                    position: layout === "vertical" ? "right" : "top",
                    fontSize: 12,
                  }}
                  radius={layout === "vertical" ? [0, 5, 5, 0] : [5, 5, 0, 0]}
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
