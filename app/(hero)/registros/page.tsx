"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingState } from "@/ui/LoadingState/LoadingState";
import { LogsHeader } from "@/ui/LogsHeader/LogsHeader";
import { ControlesPaginacao } from "@/ui/ControlesPaginacao/ControlesPaginacao";
import { useReactWebSocket } from "@/hooks/useReactWebSocket";
import { getWsUrl, WS_ENDPOINTS_NAME } from "@/config/config";
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

  const { data, isConnected, sendMessage, isLoading, isError } =
    useReactWebSocket<PaginatedLogsResponse>(
      getWsUrl(WS_ENDPOINTS_NAME.REGISTROS),
      {
        autoAck: false,
      }
    );

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
      sendMessage({
        pagina: currentPage + 1,
        itens_por_pagina: itemsPerPage,
        filtros: cleanFilters(filters),
      });
    }
  }, [currentPage, itemsPerPage, isConnected, sendMessage, filters]);

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

      // send immediately if connected so the backend can respond with filtered page 1
      if (isConnected) {
        sendMessage({
          pagina: 1,
          itens_por_pagina: itemsPerPage,
          filtros: cleanFilters(newFilters),
        });
      }
    },
    [filters, isConnected, itemsPerPage, sendMessage]
  );

  const handleClearFilters = useCallback(() => {
    const empty: typeof filters = {};
    setFilters(empty);
    setCurrentPage(0);
    if (isConnected) {
      sendMessage({
        pagina: 1,
        itens_por_pagina: itemsPerPage,
        filtros: cleanFilters(empty),
      });
    }
  }, [isConnected, itemsPerPage, sendMessage]);

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
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field>
              <FieldLabel>IP</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="127.0.0.1"
                  value={filters.ip ?? ""}
                  onChange={(e) => handleFilterChange("ip", e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Verb</FieldLabel>
              <FieldContent>
                <Select
                  value={
                    filters.verb === "" || filters.verb === undefined
                      ? "__any__"
                      : filters.verb
                  }
                  onValueChange={(v) => handleFilterChange("verb", v)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {filters.verb && filters.verb !== ""
                        ? filters.verb
                        : "Any"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__any__">Any</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Endpoint</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="/api/users"
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
                <Input
                  placeholder="200"
                  value={filters.status ?? ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  value={filters.date ?? ""}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Hour</FieldLabel>
              <FieldContent>
                <Input
                  type="time"
                  value={filters.hour ?? ""}
                  onChange={(e) => handleFilterChange("hour", e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Duration</FieldLabel>
              <FieldContent>
                <Input
                  placeholder=">100ms or 0-200"
                  value={filters.duration ?? ""}
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Protocolo</FieldLabel>
              <FieldContent>
                <Input
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
              onClick={() => {
                // always send current filters explicitly (cleaned)
                setCurrentPage(0);
                try {
                  sendMessage({
                    pagina: 1,
                    itens_por_pagina: itemsPerPage,
                    filtros: cleanFilters(filters),
                  });
                } catch (err) {
                  // best-effort: log so developer can inspect when not connected
                  // eslint-disable-next-line no-console
                  console.warn("sendMessage failed", err);
                }
              }}
            >
              Apply Filters
            </Button>
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear Filters
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
          <TabelaCompleta registros={registros} />
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
    </>
  );
}

LogsCompleto.displayName = "LogsCompleto";
