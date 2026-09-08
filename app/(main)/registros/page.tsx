"use client";

import { useEffect, useState } from "react";
import { Typography } from "@heroui/react";
import PaginationControls from "@/components/PaginationControls";
import ActiveFilters from "@/components/Filters/ActiveFilters";
import LogFilters from "@/components/Filters/LogFilters";
import Details from "@/components/Modals/LogDetails";
import LogTable from "@/components/Tables/LogTable";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";
import useLogWebSocket from "@/hooks/useLogWebSocket.hook";
import useFilter from "@/hooks/useFilter.hook";
import usePagination from "@/hooks/usePagination.hook";
import { LogFilterInType, LogOutType } from "@/types/log.type";
import { API_ROUTES } from "@/configs/api.config";

/**
 * Main page component for displaying logs.
 * It uses WebSocket to receive real-time log data,
 * supports filtering, pagination, and shows a detail modal on row click.
 */
export default function LogsPage() {
  // WebSocket connection hook; provides connection status, received messages, and send function
  const {
    isConnected,
    lastMessage: logs,
    isConnecting,
    sendMessage,
  } = useLogWebSocket({ url: API_ROUTES.logWs() });

  // Filter state and handlers: manages active filters for the log listing
  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<LogFilterInType>();

  // Pagination state and handlers: manages current page, items per page, and navigation
  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  // State for the modal that shows log details
  const [selectedLog, setSelectedLog] = useState<LogOutType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  /**
   * Handler for row click in the log table.
   * Sets the selected log and opens the details modal.
   */
  const handleRowClick = (log: LogOutType) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  /**
   * Effect to send a new WebSocket message whenever pagination or filters change.
   * This triggers the server to send updated log data matching the current criteria.
   */
  useEffect(() => {
    sendMessage({ pagina: page, itens_por_pagina: itemsPerPage, ...filters });
  }, [itemsPerPage, sendMessage, page, filters]);

  return (
    <div className="container mx-auto p-2 space-y-6">
      {/* Header section with title and connection indicator */}
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
          {/* Shows WebSocket connection status */}
          <ConnectionIndicatior
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </div>
      </div>

      {/* Filter builder component: allows users to add/remove filter criteria */}
      <LogFilters
        filters={filters}
        onResetFilters={handleResetFilters}
        onSetFilters={handleSetFilters}
      />

      {/* Displays currently active filters */}
      <ActiveFilters
        filters={filters}
        onRemoveFilters={handleRemoveFilter}
        onResetFilters={handleResetFilters}
        labelMap={{
          metodo: "Método",
          codigo: "Código",
          data_inicio: "Data início",
          data_fim: "Data fim",
          hora_inicio: "Hora início",
          hora_fim: "Hora fim",
          endpoint: "Endpoint",
          setor: "Setor",
          protocolo: "Protocolo",
          nome_cliente: "Nome cliente",
        }}
      />

      {/* Pagination controls: page navigation and items per page selector */}
      <PaginationControls
        page={page}
        totalPages={logs?.meta?.total_paginas || 1}
        totalItems={logs?.meta?.total_itens || 0}
        itemsPerPage={itemsPerPage}
        onGoToPage={handleGoToPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onSetItemsPerPage={handleSetItemsPerPage}
      />

      {/* Table displaying the log entries; shows a loading state when logs are not yet received */}
      <LogTable
        logs={logs?.data}
        isLoading={!logs}
        onRowClick={handleRowClick}
      />

      {/* Modal for showing detailed log information; only rendered when a log is selected */}
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
