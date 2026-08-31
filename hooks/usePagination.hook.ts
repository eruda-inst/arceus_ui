import { useState } from "react";

export type itemsPerPageValues = 5 | 10 | 25 | 50 | 100;

export interface usePaginationReturn {
  // States
  page: number;
  itemsPerPage: itemsPerPageValues;

  // Handles
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleGoToPage: (page: number) => void;
  handleSetItemsPerPage: (itemsPerPage: itemsPerPageValues) => void;
}

export default function usePagination(): usePaginationReturn {
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<itemsPerPageValues>(10);

  const handleNextPage = () => {
    setPage((prev) => (prev < 100 ? prev + 1 : 100));
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleGoToPage = (page: number) => {
    setPage(page);
  };

  const handleSetItemsPerPage = (itemsPerPage: itemsPerPageValues) => {
    setItemsPerPage(itemsPerPage);
    setPage(1);
  };

  return {
    // States
    page,
    itemsPerPage,

    // Handles
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handleSetItemsPerPage,
  };
}
