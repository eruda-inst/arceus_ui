import { useState } from "react";

export interface useFilterReturn<T> {
  filters: Partial<T>;
  handleSetFilters: (filters: Partial<T>) => void;
  handleResetFilters: () => void;
  handleRemoveFilter: (filter: keyof T) => void;
}

export default function useFilter<T>(): useFilterReturn<T> {
  const [filters, setFilters] = useState<Partial<T>>({});

  const handleSetFilters = (filters: Partial<T>) => {
    setFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleRemoveFilter = (filter: keyof T) => {
    setFilters((prev) => ({ ...prev, [filter]: undefined }));
  };

  return {
    filters,
    handleSetFilters,
    handleResetFilters,
    handleRemoveFilter,
  };
}
