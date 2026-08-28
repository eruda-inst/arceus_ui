import { create } from "zustand";

export type itemsPerPageValues = 5 | 10 | 25 | 50 | 100;

export type useLogPaginationType = {
  // Page
  page: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;

  // Items per page
  itemsPerPage: itemsPerPageValues;
  setItemsPerPage: (itemsPerPage: itemsPerPageValues) => void;
};

export const useLogPagination = create<useLogPaginationType>((set) => ({
  page: 1,
  itemsPerPage: 10,

  nextPage: () =>
    set((state) => ({ page: state.page < 100 ? state.page + 1 : 100 })),
  previousPage: () =>
    set((state) => ({ page: state.page > 1 ? state.page - 1 : 1 })),
  goToPage: (newPage) => set(() => ({ page: newPage })),

  setItemsPerPage: (itemsPerPage: itemsPerPageValues) =>
    set(() => ({ itemsPerPage: itemsPerPage, page: 1 })),
}));
