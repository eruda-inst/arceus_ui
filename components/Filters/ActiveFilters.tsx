import { Button, Card, Chip } from "@heroui/react";
import { FaTrash, FaXmark, FaFilter } from "react-icons/fa6";

/**
 * Props for the ActiveFilters component.
 * @template T - A record type representing the filter keys and their values.
 */
export interface ActiveFiltersProps<
  T extends Record<string, string | number | boolean>,
> {
  /** The current active filters object. */
  filters: T;
  /** Callback to reset all filters to their default/empty state. */
  onResetFilters: () => void;
  /** Callback to remove a specific filter by its key. */
  onRemoveFilters: (filter: keyof T) => void;
  /** Optional mapping from filter keys to human-readable labels. */
  labelMap?: Partial<Record<keyof T, string>>;
}

/**
 * A component that displays currently active filters as removable chips.
 * It shows a card with a title and a list of chips, each representing a filter.
 * Users can remove individual filters via chip click or reset all filters with a button.
 *
 * @template T - The type of the filters object.
 * @param props - The component props.
 * @returns The rendered JSX element, or an empty fragment if no filters are active.
 */
export default function ActiveFilters<
  T extends Record<string, string | number | boolean>,
>({
  filters,
  onResetFilters,
  onRemoveFilters,
  labelMap = {},
}: ActiveFiltersProps<T>) {
  // Build an array of active filter entries, excluding undefined, null, or empty string values.
  const activeFilters: { key: keyof T; label: string; value: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      activeFilters.push({
        key: key as keyof T,
        // Use the label from labelMap if provided, otherwise fallback to the raw key.
        label: labelMap[key] || key,
        value: String(value),
      });
    }
  });

  // If there are no active filters, render nothing.
  if (activeFilters.length === 0) {
    return <></>;
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
          {/* Button to clear all active filters at once */}
          <Button variant="danger-soft" onClick={onResetFilters}>
            <FaTrash className="size-4" /> Limpar
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row flex-wrap gap-2">
        {activeFilters.map((filter) => (
          // Each chip displays the filter label and value, and removes the filter on click.
          <Chip
            key={String(filter.key)}
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
