import { create } from "zustand";
import type { UserFilterIn } from "@/types/user.type";

type UserFilterStore = {
  filters: UserFilterIn;
  setFilters: (filters: UserFilterIn) => void;
  resetFilters: () => void;
  removeFilter: (key: keyof UserFilterIn) => void;
};

export const useUserFilter = create<UserFilterStore>()((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  removeFilter: (key) =>
    set((state) => ({
      filters: { ...state.filters, [key]: undefined },
    })),
}));
