"use client";

import { useEffect, useState, useCallback } from "react";
import Details from "@/components/Modals/Log/Details/Details";
import PaginationControls from "@/components/PaginationControls/PaginationControls";
import LogTable from "@/components/Tables/Log/Log";
import LogFilters from "@/components/Filters/Log/Filter/Filter";
import ActiveLogFilters from "@/components/Filters/Log/Active/Active";
import { useLogFilter } from "@/stores/logFilter.store";
import { LogService } from "@/services/Log";
import { LogOut, LogPaginationOut } from "@/types/log.type";
import { Button, toast } from "@heroui/react";

function Logs() {
  const getAll = LogService.getAll;
  const filters = useLogFilter((state) => state.filters);

  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogOut[]>([]);
  const [logPagination, setLogPagination] = useState<LogPaginationOut | null>(
    null,
  );
  const [selectedLog, setSelectedLog] = useState<LogOut | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  }, []);

  const handleRowClick = (log: LogOut) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const handleRefreshLogs = async () => {
    setIsRefreshing(true);
    try {
      await fetchLogs();
      toast.success("Registros atualizados com sucesso!");
    } catch (error: unknown) {
      toast.danger("Erro ao atualizar registros");
      console.error(`Erro ao atualizar registros: ${error}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const serviceFilters = {
        method: filters.metodo,
        code: filters.codigo !== undefined ? String(filters.codigo) : undefined,
        client: filters.cliente,
        department: filters.setor,
        ip: filters.ip,
        endpoint: filters.endpoint,
        data_inicio: filters.data_inicio,
        data_fim: filters.data_fim,
        hora_inicio: filters.hora_inicio,
        hora_fim: filters.hora_fim,
        protocol: filters.protocolo,
      };

      const logs = await getAll({
        page,
        itemsPerPage,
        ...serviceFilters,
      });

      setLogs(logs?.dados || []);
      if (logs) {
        setLogPagination(logs);
      }
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      toast.danger("Falha ao carregar registros.");
    } finally {
      setIsLoading(false);
    }
  }, [page, itemsPerPage, filters, getAll]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Registros
          </h1>
          <p className="text-gray-400 mt-1">
            Visualize registros de requisições
          </p>
        </div>
        <Button
          className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
          onPress={handleRefreshLogs}
          size="md"
          isPending={isRefreshing}
          isDisabled={isLoading || isRefreshing}
        >
          {({ isPending }) => (isPending ? "Atualizado..." : "Atualizar")}
        </Button>
      </div>

      <LogFilters />
      <ActiveLogFilters />

      <div className="space-y-6">
        <PaginationControls
          page={page}
          totalPages={logPagination?.total_paginas || 1}
          totalItems={logPagination?.total_itens || 0}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        <LogTable
          data={logs}
          isLoading={isLoading}
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

export default Logs;
