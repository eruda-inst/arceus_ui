"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingState } from "@/ui/LoadingState/LoadingState";
import { LogsHeader } from "@/ui/LogsHeader/LogsHeader";
import { ControlesPaginacao } from "@/ui/ControlesPaginacao/ControlesPaginacao";
import { LogsTable } from "@/ui/LogsTable/LogsTable";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { API_CONFIG } from "@/config/config";
import { Log } from "@/types/log";

interface PaginatedLogsResponse {
  registros: Log[];
  total_registros: number;
  pagina_atual: number;
  itens_por_pagina: number;
  total_paginas: number;
}

export default function LogsCompleto() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isConnected, sendMessage, isLoading, isError } =
    useReactWebSocket<PaginatedLogsResponse>(API_CONFIG.WS.ROTAS.REGISTROS, {
      autoAck: false,
    });

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        pagina: currentPage + 1,
        itens_por_pagina: itemsPerPage,
      });
    }
  }, [currentPage, itemsPerPage, isConnected, sendMessage]);

  const handlePageClick = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    const newItemsPerPage = Number(value);
    if (!Number.isNaN(newItemsPerPage) && newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(0);
    }
  }, []);

  if (!data) {
    return (
      <LoadingState
        isConnected={isConnected}
        isLoading={isLoading}
        isError={isError}
      />
    );
  }

  const { registros, total_registros, total_paginas } = data;

  return (
    <>
      <LogsHeader totalLogs={total_registros} isConnected={isConnected} />
      <ControlesPaginacao
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageClick}
        pageCount={total_paginas}
        currentPage={currentPage}
        variant="top"
      />
      <LogsTable logs={registros} />
      {total_paginas > 1 && (
        <ControlesPaginacao
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageClick}
          pageCount={total_paginas}
          currentPage={currentPage}
          variant="bottom"
        />
      )}
    </>
  );
}

LogsCompleto.displayName = "LogsCompleto";
