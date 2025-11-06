import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  valueGeral: ReactNode;
  valueHoje: ReactNode;
}

export function MetricCard({ title, valueGeral, valueHoje }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between items-center p-3 bg-accent rounded-lg border">
            <span className="text-sm text-muted-foreground">Geral</span>
            <span className="text-xl font-bold text-muted-foreground">
              {valueGeral}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-bg-selected rounded-lg border">
            <span className="text-sm">Hoje</span>
            <span className="text-xl font-bold">{valueHoje}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

MetricCard.displayName = "MetricCard";
