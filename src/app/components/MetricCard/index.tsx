import { ReactNode } from "react";
import { Card } from "@/app/components/Card";

interface MetricCardProps {
  title: string;
  value: string;
  children?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  children,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: MetricCardProps) {
  return (
    <Card className="flex-row h-24 items-center">
      <dl className="h-full flex flex-col justify-between w-full">
        <dt className="text-sm text-gray-500 dark:text-gray-400">{title}</dt>
        <dd className="text-2xl font-bold">{value}</dd>
      </dl>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor} ${iconColor}`}
      >
        {children}
      </div>
    </Card>
  );
}

MetricCard.displayName = "MetricCard";
