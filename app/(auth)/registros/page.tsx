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
  pagina_contagem: number;
}

export default function LogsCompleto() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isConnected, sendMessage, isLoading, isError } =
    useReactWebSocket<PaginatedLogsResponse>(
      API_CONFIG.WS_ENDPOINTS.REGISTROS,
      {
        autoAck: false,
      }
    );

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        page: currentPage,
        items_per_page: itemsPerPage,
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

  const { registros, total_registros, pagina_contagem } = data;

  return (
    <>
      <LogsHeader totalLogs={total_registros} isConnected={isConnected} />
      <ControlesPaginacao
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageClick}
        pageCount={pagina_contagem}
        currentPage={currentPage}
        variant="top"
      />
      <LogsTable logs={registros} />
      {pagina_contagem > 1 && (
        <ControlesPaginacao
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageClick}
          pageCount={pagina_contagem}
          currentPage={currentPage}
          variant="bottom"
        />
      )}
    </>
  );
}

LogsCompleto.displayName = "LogsCompleto";
