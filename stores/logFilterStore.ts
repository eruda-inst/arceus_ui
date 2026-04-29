import { create } from "zustand";
import { LogFilterIn } from "@/types/logType";

type LogFilterStore = {
  filters: LogFilterIn;
  setFilters: (filters: LogFilterIn) => void;
  resetFilters: () => void;
  removeFilter: (key: keyof LogFilterIn) => void;
};

const useLogFilter = create<LogFilterStore>()((set) => ({
  filters: {},
  setFilters: (filters: LogFilterIn) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  removeFilter: (key: keyof LogFilterIn) =>
    set((state) => ({ filters: { ...state.filters, [key]: undefined } })),
}));

export { useLogFilter };
