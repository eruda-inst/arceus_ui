import { Button, Card, Chip } from "@heroui/react";
import { FaTrash, FaXmark, FaFilter } from "react-icons/fa6";
import type { UserFilterIn } from "@/types/user.type";

export interface ActiveUserFiltersProp {
  filters: UserFilterIn;
  onResetFilters: () => void;
  onRemoveFilters: (filter: keyof UserFilterIn) => void;
}

export default function ActiveUserFilters({
  filters,
  onResetFilters,
  onRemoveFilters,
}: ActiveUserFiltersProp) {
  const activeFilters: {
    key: keyof UserFilterIn;
    label: string;
    value: string;
  }[] = [];

  const labelMap: Record<string, string> = {
    nome: "Nome",
    email: "Email",
    nome_grupo: "Nome do grupo",
    ativo: "Ativo",
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      activeFilters.push({
        key: key as keyof UserFilterIn,
        label: labelMap[key] || key,
        value: String(value),
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
          <Button variant="danger-soft" onClick={onResetFilters}>
            <FaTrash className="size-4" /> Limpar
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Chip
            key={filter.key}
            onClick={() => onRemoveFilters(filter.key)}
            size="lg"
          >
            {filter.label}: {filter.value} <FaXmark />
          </Chip>
        ))}
      </Card.Content>
    </Card>
  );
}
