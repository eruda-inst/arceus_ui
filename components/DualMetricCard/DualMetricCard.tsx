import { Card, Skeleton } from "@heroui/react";

interface DualMetricCardProps {
  title: string;
  description: string;
  metric1Label: string;
  metric1Value: { hoje: number; sempre: number };
  metric2Label?: string;
  metric2Value?: { hoje: number; sempre: number };
  formatMetric1?: (value: number) => string;
  formatMetric2?: (value: number) => string;
  isLoading: boolean;
}

function DualMetricCard({
  title,
  description,
  metric1Label,
  metric1Value,
  metric2Label,
  metric2Value,
  formatMetric1,
  formatMetric2,
  isLoading,
}: DualMetricCardProps) {
  return (
    <Card className="h-40">
      <Card.Header>
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
              <p className="text-sm font-medium">Hoje</p>
              <p>
                {metric1Label}:{" "}
                {formatMetric1
                  ? formatMetric1(metric1Value?.hoje ?? 0)
                  : metric1Value?.hoje}
              </p>
              {metric2Label && (
                <p>
                  {metric2Label}:{" "}
                  {formatMetric2
                    ? formatMetric2(metric2Value?.hoje ?? 0)
                    : metric2Value?.hoje}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Sempre</p>
              <p>
                {metric1Label}:{" "}
                {formatMetric1
                  ? formatMetric1(metric1Value?.sempre ?? 0)
                  : metric1Value?.sempre}
              </p>
              {metric2Label && (
                <p>
                  {metric2Label}:{" "}
                  {formatMetric2
                    ? formatMetric2(metric2Value?.sempre ?? 0)
                    : metric2Value?.sempre}
                </p>
              )}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

export default DualMetricCard;
