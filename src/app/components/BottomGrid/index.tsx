import { ReactNode } from "react";

interface BottomGridProps {
  children: ReactNode;
}

export function BottomGrid({ children }: BottomGridProps) {
  return <div className="flex gap-x-6">{children}</div>;
}

BottomGrid.displayName = "BottomGrid";
