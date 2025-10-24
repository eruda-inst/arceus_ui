import ReactPaginate from "react-paginate";

interface PaginationControlsProps {
  itemsPerPage: number;
  onItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (event: { selected: number }) => void;
  pageCount: number;
  currentPage: number;
  variant: "top" | "bottom";
}

export function PaginationControls({
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  pageCount,
  currentPage,
  variant,
}: PaginationControlsProps) {
  const isTop = variant === "top";

  return (
    <div
      className={`bg-bg-light dark:bg-bg-dark rounded-lg shadow p-4 border border-border-light dark:border-border-dark ${
        isTop ? "mb-4" : "mt-4"
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${
          !isTop ? "flex-row" : ""
        }`}
      >
        {isTop ? (
          <div className="flex items-center space-x-3">
            <label htmlFor="itemsPerPage" className="text-sm font-medium">
              Itens por página
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="border border-border-light dark:border-border-dark rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-bg-light dark:bg-bg-dark"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        ) : (
          <div className="text-sm">
            Página {currentPage + 1} de {pageCount} • {itemsPerPage} itens por
            página
          </div>
        )}

        <ReactPaginate
          breakLabel="..."
          nextLabel="Próximo >"
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel="< Anterior"
          renderOnZeroPageCount={null}
          forcePage={currentPage}
          containerClassName={`flex items-center space-x-2 ${
            !isTop ? "space-x-2" : ""
          }`}
          pageClassName="flex items-center justify-center w-8 h-8 text-sm border border-border-light dark:border-border-dark rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          activeClassName="bg-indigo-600 text-white border-indigo-600"
          previousClassName="flex items-center justify-center px-3 h-8 text-sm border border-border-light dark:border-border-dark rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          nextClassName="flex items-center justify-center px-3 h-8 text-sm border border-border-light dark:border-border-dark rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
}

PaginationControls.displayName = "PaginationControls";
