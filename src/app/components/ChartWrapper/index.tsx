import { ReactNode } from "react";
import { Card } from "@/app/components/Card";

interface ChartWrapperProps {
  children: ReactNode;
}

export function ChartWrapper({ children }: ChartWrapperProps) {
  return <Card>{children}</Card>;
}

ChartWrapper.displayName = "ChartWrapper";
