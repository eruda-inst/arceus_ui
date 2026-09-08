"use client";

import { Card, Skeleton } from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Props for the LineChartCard component.
 * All properties are optional except label, description, and dataKey,
 * but sensible defaults are provided.
 */
export interface LineChartCardProps {
  /** Array of data objects to be plotted. Each object should contain the keys used in dataKey and lineDataKey. */
  data?: Record<string, number | string | boolean>[];
  /** Main title label of the card. */
  label: string;
  /** Name displayed in the tooltip and legend for the line series. Defaults to "Total de requisições". */
  name?: string;
  /** Description/subtitle text below the label. */
  description: string;
  /** Key in each data object used for the X-axis categories. */
  dataKey: string;
  /** Key in each data object used for the line values. Defaults to "total_requisicoes". */
  lineDataKey?: string;
  /** Stroke color of the line. Defaults to a cyan (#21e8fa). */
  lineColor?: string;
  /** Fill color of the active dot when hovering. Defaults to an orange (#fa7b20). */
  activeDotColor?: string;
  /** If true, shows a skeleton loading state instead of the chart. */
  isLoading?: boolean;
  /** If true, hides the X-axis labels and ticks. */
  hideXAxis?: boolean;
}

/**
 * A card component that displays a line chart using recharts.
 * It includes a loading skeleton, a fallback "no data" message,
 * and customizable colors and labels.
 */
export default function LineChartCard({
  data = [],
  label,
  name = "Total de requisições",
  description = "",
  dataKey,
  lineDataKey = "total_requisicoes",
  lineColor = "#21e8fa",
  activeDotColor = "#fa7b20",
  isLoading = false,
  hideXAxis = false,
}: LineChartCardProps) {
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
               * Render the line chart when data is available.
               * The chart is responsive and uses a fixed aspect ratio.
               */
              <LineChart
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
                {/* Grid lines with dashed style */}
                <CartesianGrid strokeDasharray="3 3" />
                {/* X-axis with optional hiding */}
                <XAxis dataKey={dataKey} hide={hideXAxis} />
                {/* Y-axis auto-sized */}
                <YAxis width="auto" />
                {/* Custom styled tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    borderRadius: "5px",
                    color: "#f9fafb",
                  }}
                  wrapperStyle={{ borderRadius: "10px" }}
                  separator=": "
                  cursor={{ fillOpacity: 0.5, fill: lineColor }}
                />
                {/* Legend for the series */}
                <Legend />
                {/* The main Line component with monotone interpolation */}
                <Line
                  type="monotone"
                  dataKey={lineDataKey}
                  stroke={lineColor}
                  activeDot={{ fill: activeDotColor }}
                  label={{ position: "top", fontSize: 12 }}
                  name={name}
                />
              </LineChart>
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
