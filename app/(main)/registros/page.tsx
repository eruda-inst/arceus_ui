"use client";

import { useEffect, useState } from "react";
import { ColorSwatch } from "@heroui/react";
import { clsx } from "clsx";
import PaginationControls from "@/components/PaginationControls";
import ActiveLogFilters from "@/components/Filters/ActiveLogFilters";
import LogFilters from "@/components/Filters/LogFilters";
import Details from "@/components/Modals/LogDetails";
import LogTable from "@/components/Tables/LogTable";
import useLogWebSocket from "@/hooks/useLogWebSocket.hook";
import useFilter from "@/hooks/useFilter.hook";
import { LogFilterIn, LogOut } from "@/types/log.type";
import { API_ROUTES } from "@/configs/api.config";
import usePagination from "@/hooks/usePagination.hook";

export default function Logs() {
  const { isConnected, lastMessage, isConnecting, sendMessage } =
    useLogWebSocket({ url: API_ROUTES.logWs });

  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<LogFilterIn>();

  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  const [selectedLog, setSelectedLog] = useState<LogOut | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleRowClick = (log: LogOut) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    sendMessage({ pagina: page, itens_por_pagina: itemsPerPage, ...filters });
  }, [itemsPerPage, sendMessage, page, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Registros
          </h1>
          <p className="text-muted">
            Os registros são atualizados automaticamente, não é necessário
            recarregar a página
          </p>
        </div>
        <span
          className={clsx(
            "flex items-center gap-x-2",
            isConnecting
              ? "text-blue-500"
              : isConnected
                ? "text-green-500"
                : "text-red-500",
          )}
        >
          {isConnecting
            ? "Conectando..."
            : isConnected
              ? "Conectado"
              : "Desconectado"}
          <ColorSwatch
            className="animate-pulse"
            size="xs"
            color={isConnecting ? "#00f" : isConnected ? "#0f0" : "#f00"}
          />
        </span>
      </div>

      <LogFilters
        filters={filters}
        onResetFilters={handleResetFilters}
        onSetFilters={handleSetFilters}
      />

      <ActiveLogFilters
        filters={filters}
        onRemoveFilters={handleRemoveFilter}
        onResetFilters={handleResetFilters}
      />

      <div className="space-y-6">
        <PaginationControls
          page={page}
          totalPages={lastMessage?.meta?.total_paginas || 1}
          totalItems={lastMessage?.meta?.total_itens || 0}
          itemsPerPage={itemsPerPage}
          onGoToPage={handleGoToPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSetItemsPerPage={handleSetItemsPerPage}
        />
        <LogTable
          data={lastMessage?.data}
          isLoading={!lastMessage}
          onRowClick={handleRowClick}
        />
      </div>

      {selectedLog && (
        <Details
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          log={selectedLog}
          handleClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}
