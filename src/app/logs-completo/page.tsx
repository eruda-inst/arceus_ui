"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingState } from "@/app/components/LoadingState";
import { LogsHeader } from "@/app/components/LogsHeader";
import { PaginationControls } from "@/app/components/PaginationControls";
import { LogsTable } from "@/app/components/LogsTable";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_CONFIG } from "@/utils/config";
import { Log } from "@/utils/type/log";

interface PaginatedLogsResponse {
  logs: Log[];
  total_logs: number;
  current_page: number;
  items_per_page: number;
  page_count: number;
}

export default function LogsCompleto() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isConnected, sendMessage, isLoading, isError } =
    useWebSocket<PaginatedLogsResponse>(API_CONFIG.WS_ENDPOINTS.LOGS, {
      autoAck: false,
    });

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

  const handleItemsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newItemsPerPage = Number(event.target.value);
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(0);
    },
    []
  );

  if (!data) {
    return (
      <LoadingState
        isConnected={isConnected}
        isLoading={isLoading}
        isError={isError}
      />
    );
  }

  const { logs, total_logs, page_count } = data;

  return (
    <div className="min-h-screen">
      <LogsHeader totalLogs={total_logs} isConnected={isConnected} />
      <PaginationControls
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageClick}
        pageCount={page_count}
        currentPage={currentPage}
        variant="top"
      />
      <LogsTable logs={logs} />
      {page_count > 1 && (
        <PaginationControls
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageClick}
          pageCount={page_count}
          currentPage={currentPage}
          variant="bottom"
        />
      )}
    </div>
  );
}

LogsCompleto.displayName = "LogsCompleto";
