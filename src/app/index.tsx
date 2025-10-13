import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

export function ChartCard({ title, children, headerActions }: ChartCardProps) {
  return (
    <div className="p-4 flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md gap-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        {headerActions}
      </div>
      {children}
    </div>
  );
}
