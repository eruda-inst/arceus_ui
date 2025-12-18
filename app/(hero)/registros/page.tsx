"use client";

import { useState, useEffect, useCallback } from "react";
import { LogsHeader } from "@/ui/LogsHeader/LogsHeader";
import { ControlesPaginacao } from "@/ui/ControlesPaginacao/ControlesPaginacao";
import { useMetricaWebSocket } from "@/hooks/useMetricaWebSocket";
import { Log } from "@/types/log";
import { TabelaCompleta } from "@/ui/TabelaCompleta/TabelaCompleta";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTituloPaginaSimples } from "@/hooks/useTituloPagina";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginatedLogsResponse {
  registros: Log[];
  total_registros: number;
  pagina_atual: number;
  itens_por_pagina: number;
  total_paginas: number;
}

export default function LogsCompleto() {
  useTituloPaginaSimples("Absol · Registros");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<PaginatedLogsResponse | null>(null);
  const { redirectIfNoPermission, loading } = useAuth();

  const [filters, setFilters] = useState<{
    ip?: string;
    verb?: string;
    endpoint?: string;
    status?: string;
    date?: string;
    hour?: string;
    duration?: string;
    protocol?: string;
  }>({});

  const {
    error: wsError,
    isConnected,
    sendMetricaRequest,
  } = useMetricaWebSocket({
    onMessage: (data) => {
      if (data.registros) {
        setData(data as PaginatedLogsResponse);
      }
    },
    autoConnect: true,
    requirePermission: "registros:ver",
  });

  function cleanFilters(f: typeof filters) {
    const out: Record<string, string> = {};
    Object.entries(f).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        out[k] = String(v).trim();
      }
    });
    return out;
  }

  useEffect(() => {
    if (isConnected) {
      sendMetricaRequest("registros", undefined, {
        pagina: currentPage + 1,
        itens_por_pagina: itemsPerPage,
        filtros: cleanFilters(filters),
        matched: true,
      });
    }
  }, [currentPage, itemsPerPage, filters, isConnected, sendMetricaRequest]);

  useEffect(() => {
    if (!loading) {
      redirectIfNoPermission("registros:ver");
    }
  }, [loading, redirectIfNoPermission]);

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

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const normalized = value === "__any__" ? "" : value;
      const newFilters = { ...filters, [key]: normalized };
      setFilters(newFilters);
      setCurrentPage(0);
    },
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    const empty: typeof filters = {};
    setFilters(empty);
    setCurrentPage(0);
  }, []);

  const isLoading = !data && isConnected;
  const isError = wsError !== null;

  const { registros, total_registros, total_paginas } =
    (data as PaginatedLogsResponse) || {};

  return (
    <>
      <LogsHeader totalLogs={total_registros} isConnected={isConnected} />
      {!data || isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-62.5" />
          <Skeleton className="w-full h-22.5" />
          <Skeleton className="w-full h-107.5" />
          <Skeleton className="w-full h-22.5" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <Card>
            <CardContent>
              <div className="grid gap-4 grid-cols-4">
                <Field>
                  <FieldLabel htmlFor="ip">IP</FieldLabel>
                  <FieldContent>
                    <Input
                      id="ip"
                      type="text"
                      placeholder="192.168.0.100"
                      value={filters.ip ?? ""}
                      onChange={(e) => handleFilterChange("ip", e.target.value)}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="verbo">Verbo</FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        filters.verb === "" || filters.verb === undefined
                          ? "__any__"
                          : filters.verb
                      }
                      onValueChange={(v) => handleFilterChange("verb", v)}
                    >
                      <SelectTrigger className="w-full" id="verbo">
                        <SelectValue>
                          {filters.verb && filters.verb !== ""
                            ? filters.verb
                            : "Selecione"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any__">Selecione</SelectItem>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="endpoint">Endpoint</FieldLabel>
                  <FieldContent>
                    <Input
                      id="endpoint"
                      placeholder="/api/v1/financeiro/chave_pix"
                      value={filters.endpoint ?? ""}
                      onChange={(e) =>
                        handleFilterChange("endpoint", e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        filters.status === "" || filters.status === undefined
                          ? "__any__"
                          : filters.status
                      }
                      onValueChange={(v) => handleFilterChange("status", v)}
                    >
                      <SelectTrigger className="w-full" id="status">
                        <SelectValue>
                          {filters.status && filters.status !== ""
                            ? filters.status
                            : "Selecione"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any__">Selecione</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="201">201</SelectItem>
                        <SelectItem value="404">404</SelectItem>
                        <SelectItem value="422">422</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="503">503</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="data">Data</FieldLabel>
                  <FieldContent>
                    <Input
                      id="data"
                      type="date"
                      value={filters.date ?? ""}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleFilterChange("date", e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="hora">Hora</FieldLabel>
                  <FieldContent>
                    <Input
                      id="hora"
                      type="time"
                      value={filters.hour ?? ""}
                      onChange={(e) =>
                        handleFilterChange("hour", e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="duracao">Duration</FieldLabel>
                  <FieldContent>
                    <Input
                      id="duracao"
                      placeholder=">100 ou 0-200"
                      value={filters.duration ?? ""}
                      onChange={(e) =>
                        handleFilterChange("duration", e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="protocolo">Protocolo</FieldLabel>
                  <FieldContent>
                    <Input
                      id="protocolo"
                      placeholder="NWT202512345"
                      value={filters.protocol ?? ""}
                      onChange={(e) =>
                        handleFilterChange("protocol", e.target.value)
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="hover:cursor-pointer"
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
          <ControlesPaginacao
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPageChange={handlePageClick}
            pageCount={total_paginas}
            currentPage={currentPage}
            variant="top"
          />
          <Card>
            <CardContent>
              <TabelaCompleta
                registros={registros}
                isLoading={isLoading}
                isError={isError}
              />
            </CardContent>
          </Card>
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
        </div>
      )}
    </>
  );
}

LogsCompleto.displayName = "LogsCompleto";
