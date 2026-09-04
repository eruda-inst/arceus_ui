"use client";

import { useEffect, useState } from "react";
import { Typography } from "@heroui/react";
import PaginationControls from "@/components/PaginationControls";
import ActiveLogFilters from "@/components/Filters/ActiveLogFilters";
import LogFilters from "@/components/Filters/LogFilters";
import Details from "@/components/Modals/LogDetails";
import LogTable from "@/components/Tables/LogTable";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";
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
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography
            type="h2"
            className="bg-linear-to-r from-purple-500 to-indigo-500 w-fit text-transparent bg-clip-text"
          >
            Registros
          </Typography>
          <p className="text-muted">Visualize informações das requisições</p>
          <p className="text-warning-soft-foreground">
            As informações são atualizadas automaticamente, não é necessário
            recarregar a página
          </p>
          <ConnectionIndicatior
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </div>
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
        logs={lastMessage?.data}
        isLoading={!lastMessage}
        onRowClick={handleRowClick}
      />

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
