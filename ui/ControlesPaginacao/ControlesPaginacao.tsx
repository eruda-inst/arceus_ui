import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface PaginationControlsProps {
  itemsPerPage: number;
  onItemsPerPageChange: (value: string) => void;
  onPageChange: (event: { selected: number }) => void;
  pageCount: number;
  currentPage: number;
  variant: "top" | "bottom";
}

export function ControlesPaginacao({
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  pageCount,
  currentPage,
  variant,
}: PaginationControlsProps) {
  const isTop = variant === "top";

  // Função para gerar os números de página visíveis
  const getVisiblePages = () => {
    if (pageCount <= 1) return [];

    const pages = [];
    const delta = 1;

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= currentPage + 1 - delta && i <= currentPage + 1 + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage + 1 - delta - 1 ||
        i === currentPage + 1 + delta + 1
      ) {
        // Evita ellipsis duplicados consecutivos
        if (pages[pages.length - 1] !== "ellipsis") {
          pages.push("ellipsis");
        }
      }
    }

    return pages;
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange({ selected: pageNumber });
  };

  const handlePreviousClick = () => {
    if (currentPage > 0) {
      onPageChange({ selected: currentPage - 1 });
    }
  };

  const handleNextClick = () => {
    if (currentPage < pageCount - 1) {
      onPageChange({ selected: currentPage + 1 });
    }
  };

  const visiblePages = getVisiblePages();

  // Se não há páginas, não renderiza nada
  if (pageCount <= 1) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {isTop ? (
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="itemsPerPage"
                className="text-sm font-medium whitespace-nowrap"
              >
                Itens por página
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={onItemsPerPageChange}
              >
                <SelectTrigger className="w-20" id="itemsPerPage">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-sm">
              Página {currentPage + 1} de {pageCount} • {itemsPerPage} itens por
              página
            </div>
          )}

          <Pagination>
            <PaginationContent>
              {/* Botão Anterior */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousClick}
                  className={
                    currentPage === 0
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Números de página */}
              {visiblePages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageClick((page as number) - 1)}
                      isActive={currentPage + 1 === page}
                      className="cursor-pointer"
                    >
                      {page as number}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Botão Próximo */}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextClick}
                  className={
                    currentPage >= pageCount - 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}

ControlesPaginacao.displayName = "ControlesPaginacao";
