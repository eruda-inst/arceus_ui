import { ReactNode } from "react";

interface BottomGridProps {
  children: ReactNode;
}

export function BottomGrid({ children }: BottomGridProps) {
  return <div className="gap-6 grid grid-cols-2">{children}</div>;
}

BottomGrid.displayName = "BottomGrid";
