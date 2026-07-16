"use client";

import { Card, Skeleton, Spinner } from "@heroui/react";

interface MetricItem {
  label: string;
  value: { hoje: number; sempre: number };
  format?: (v: number) => string;
}

interface MetricCardProps {
  title: string;
  description: string;
  metrics: MetricItem[];
  isLoading?: boolean;
}

export function MetricCard({
  title,
  description,
  metrics,
  isLoading = false,
}: MetricCardProps) {
  return (
    <Card>
      <Card.Header className="space-y-3">
        <Card.Title className="text-lg font-bold">{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>

      <Card.Content>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-md font-medium">Hoje</p>

              <div className="flex flex-col gap-1 mt-1 text-sm">
                {metrics.map((metric, idx) => (
                  <div key={idx}>
                    <span>{metric.label}: </span>
                    <span className="font-mono">
                      {metric.format
                        ? metric.format(metric.value.hoje)
                        : metric.value.hoje.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <p className="text-md font-medium">Sempre</p>

              <div className="flex flex-col gap-1 mt-1 text-sm">
                {metrics.map((metric, idx) => (
                  <div key={idx}>
                    <span>{metric.label}: </span>
                    <span className="font-mono">
                      {metric.format
                        ? metric.format(metric.value.sempre)
                        : metric.value.sempre.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
