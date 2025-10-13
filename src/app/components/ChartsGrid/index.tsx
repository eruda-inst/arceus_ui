import { ChartCard } from "@/app/components/ChartCard";

export function ChartsGrid() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Gráfico de Linha (Recharts) */}
      <ChartCard title="Requisições por Hora" />
      {/* Gráfico de Barras (Recharts) */}
      <ChartCard title="Distribuição de Status Codes" />
    </div>
  );
}

ChartsGrid.displayName = "ChartsGrid";
