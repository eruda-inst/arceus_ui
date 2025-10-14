import { ReactNode } from "react";

interface ChartsGridProps {
  children: ReactNode;
}

export function ChartsGrid({ children }: ChartsGridProps) {
  return <div className="grid grid-cols-2 gap-6">{children}</div>;
}

ChartsGrid.displayName = "ChartsGrid";
