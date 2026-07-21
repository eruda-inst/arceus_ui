import { Button, Card, Chip } from "@heroui/react";
import { FaTrash, FaXmark, FaFilter } from "react-icons/fa6";
import { useLogFilter } from "@/stores/logFilter.store";
import { LogFilterIn } from "@/types/log.type";

function ActiveLogFilters() {
  const filters = useLogFilter((state) => state.filters);
  const removeFilter = useLogFilter((state) => state.removeFilter);
  const resetFilters = useLogFilter((state) => state.resetFilters);

  const activeFilters: {
    key: keyof LogFilterIn;
    label: string;
    value: string;
  }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const displayValue = String(value);

      const labelMap: Record<string, string> = {
        metodo: "Método",
        codigo: "Código",
        data_inicio: "Data início",
        data_fim: "Data fim",
        hora_inicio: "Hora início",
        hora_fim: "Hora fim",
        endpoint: "Endpoint",
        setor: "Setor",
        protocolo: "Protocolo",
        nome_cliente: "Nome cliente",
      };

      activeFilters.push({
        key: key as keyof LogFilterIn,
        label: labelMap[key] || key,
        value: displayValue,
      });
    }
  });

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <Card.Header>
        <Card.Title className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-x-2">
            <FaFilter className="size-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              Filtros Ativos
            </span>
          </div>
          <Button variant="danger-soft" onClick={resetFilters}>
            <FaTrash className="size-4" /> Limpar
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Chip
            key={filter.key}
            onClick={() => removeFilter(filter.key)}
            size="lg"
          >
            {filter.label}: {filter.value} <FaXmark />
          </Chip>
        ))}
      </Card.Content>
    </Card>
  );
}

export default ActiveLogFilters;
