import { useLogPagination } from "@/stores/useLogPagination.store";
import type { itemsPerPageValues } from "@/stores/useLogPagination.store";
import { v4 as uuid } from "uuid";
import { Card, Label, ListBox, Pagination, Select } from "@heroui/react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalItems: number;
}

export default function PaginationControls({
  page,
  totalPages,
  totalItems,
}: PaginationControlsProps) {
  const itemsPerPage = useLogPagination((state) => state.itemsPerPage);
  const nextPage = useLogPagination((state) => state.nextPage);
  const previousPage = useLogPagination((state) => state.previousPage);
  const goToPage = useLogPagination((state) => state.goToPage);
  const setItemsPerPage = useLogPagination((state) => state.setItemsPerPage);

  const safeTotalPages = totalPages || 1;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(safeTotalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < safeTotalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(safeTotalPages);

    if (pages.every((p) => p === 1)) {
      pages.pop();
    }

    return pages;
  };

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <Card className="border">
      <Card.Content>
        <div className="flex items-center justify-between gap-4">
          <Select
            variant="secondary"
            placeholder="Itens por página"
            value={itemsPerPage}
            onChange={(v) => setItemsPerPage(v as itemsPerPageValues)}
            className="w-40"
          >
            <Label>Itens por página</Label>

            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                {[5, 10, 25, 50, 100].map((item) => (
                  <ListBox.Item
                    key={`option-${item}`}
                    id={item}
                    textValue={item.toString()}
                  >
                    {item}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Pagination>
            <Pagination.Summary>
              <p>
                Página {startItem}-{endItem}, total de {totalItems} resultados
              </p>
            </Pagination.Summary>

            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={previousPage}
                >
                  <Pagination.PreviousIcon />
                  <span>Anterior</span>
                </Pagination.Previous>
              </Pagination.Item>

              {getPageNumbers().map((p) =>
                p === "ellipsis" ? (
                  <Pagination.Item key={uuid()}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={uuid()}>
                    <Pagination.Link
                      isActive={p === page}
                      className={`${p === page ? "bg-linear-to-r" : ""} from-blue-500 to-indigo-500 text-white font-bold`}
                      onPress={() => goToPage(p)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === safeTotalPages}
                  onPress={nextPage}
                >
                  <span>Próxima</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      </Card.Content>
    </Card>
  );
}
