"use client";

import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Skeleton } from "@heroui/react";

/**
 * Props for the BarChartCard component.
 * All properties are optional except label, description, and dataKey,
 * but sensible defaults are provided.
 */
export interface BarChartCardProps {
  /** Array of data objects to be plotted. Each object should contain the keys used in dataKey and barDataKey. */
  data?: Record<string, number | string | boolean>[];
  /** Main title label of the card. */
  label: string;
  /** Name displayed in the tooltip and legend for the bar series. Defaults to "Total de requisições". */
  name?: string;
  /** Description/subtitle text below the label. */
  description: string;
  /** Key in each data object used for the X-axis (if horizontal) or Y-axis (if vertical) categories. */
  dataKey: string;
  /** Key in each data object used for the bar values. Defaults to "total_requisicoes". */
  barDataKey?: string;
  /** Fill color of the bars. Defaults to a sky blue (#0ea5e9). */
  barColor?: string;
  /** Fill color when a bar is hovered/active. Defaults to an orange (#f15a16). */
  activeBarColor?: string;
  /** If true, shows a skeleton loading state instead of the chart. */
  isLoading?: boolean;
  /** If true, hides the X-axis labels and ticks. */
  hideXAxis?: boolean;
  /** If true, hides the Y-axis labels and ticks. */
  hideYAxis?: boolean;
  /** Orientation of the chart: "vertical" means bars are vertical (default), "horizontal" means bars are horizontal. */
  layout?: "vertical" | "horizontal";
}

/**
 * A card component that displays a bar chart using recharts.
 * It supports both vertical and horizontal bar layouts, loading states,
 * customizable colors, and a fallback "no data" message.
 */
export default function BarChartCard({
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
}: BarChartCardProps) {
  return (
    <>
      {/* Show skeleton loader while data is loading */}
      {isLoading ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : (
        <Card className="border bg-surface min-h-80">
          {/* Card header with title and description */}
          <Card.Header className="space-y-3">
            <Card.Title className="text-lg font-bold">{label}</Card.Title>
            <Card.Description>{description}</Card.Description>
          </Card.Header>

          <Card.Content>
            {data && data.length > 0 ? (
              /**
               * Render the bar chart when data is available.
               * The layout prop is inverted because recharts uses "horizontal" for vertical bars
               * and "vertical" for horizontal bars. We map our prop to recharts' expectation.
               */
              <BarChart
                layout={layout === "vertical" ? "horizontal" : "vertical"}
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
                {/* X-axis configuration: category axis for vertical bars, number axis for horizontal bars */}
                <XAxis
                  type={layout === "vertical" ? "category" : "number"}
                  dataKey={layout === "vertical" ? dataKey : undefined}
                  hide={hideXAxis}
                  width="auto"
                />
                {/* Y-axis configuration: number axis for vertical bars, category axis for horizontal bars */}
                <YAxis
                  type={layout === "vertical" ? "number" : "category"}
                  dataKey={layout === "vertical" ? undefined : dataKey}
                  hide={hideYAxis}
                  width="auto"
                />
                {/* Custom tooltip styling */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    borderRadius: "5px",
                    color: "#f9fafb",
                  }}
                  wrapperStyle={{ borderRadius: "10px" }}
                  separator=": "
                  cursor={{ fillOpacity: 0.5, fill: barColor }}
                />
                {/* The main Bar component with dynamic positioning and styling */}
                <Bar
                  dataKey={barDataKey}
                  fill={barColor}
                  activeBar={{ fill: activeBarColor }}
                  label={{
                    position: layout === "vertical" ? "top" : "right",
                    fontSize: 12,
                  }}
                  radius={layout === "vertical" ? [5, 5, 0, 0] : [0, 5, 5, 0]}
                  maxBarSize={75}
                  name={name}
                />
              </BarChart>
            ) : (
              // Fallback message when no data is provided
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
