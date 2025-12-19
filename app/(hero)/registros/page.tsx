"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { useTituloPaginaSimples } from "@/hooks/useTituloPagina";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

  // Estado separado para o Range de Datas
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [filters, setFilters] = useState<{
    ip?: string;
    verb?: string;
    endpoint?: string;
    status?: string;
    hour?: string;
    duration?: string;
    protocol?: string;
    // Removemos 'date' daqui pois agora é controlado pelo dateRange
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

  function cleanFilters(f: typeof filters, dRange: DateRange | undefined) {
    const out: Record<string, string> = {};

    // Processa filtros de texto padrão
    Object.entries(f).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        out[k] = String(v).trim();
      }
    });

    // Processa o intervalo de datas
    if (dRange?.from) {
      out["start_date"] = format(dRange.from, "yyyy-MM-dd");
    }
    if (dRange?.to) {
      out["end_date"] = format(dRange.to, "yyyy-MM-dd");
    }

    return out;
  }

  useEffect(() => {
    if (isConnected) {
      sendMetricaRequest("registros", undefined, {
        pagina: currentPage + 1,
        itens_por_pagina: itemsPerPage,
        filtros: cleanFilters(filters, dateRange),
        matched: true,
      });
    }
    // Adicionamos dateRange às dependências
  }, [
    currentPage,
    itemsPerPage,
    filters,
    dateRange,
    isConnected,
    sendMetricaRequest,
  ]);

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
    setDateRange(undefined); // Limpa também o range de datas
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
                      placeholder="/api/v1/..."
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

                {/* Novo Componente de Intervalo de Datas */}
                <Field>
                  <FieldLabel htmlFor="date-range">Período</FieldLabel>
                  <FieldContent>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-range"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd/MM/y", {
                                  locale: ptBR,
                                })}{" "}
                                -{" "}
                                {format(dateRange.to, "dd/MM/y", {
                                  locale: ptBR,
                                })}
                              </>
                            ) : (
                              format(dateRange.from, "dd/MM/y", {
                                locale: ptBR,
                              })
                            )
                          ) : (
                            <span>Selecione datas</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={(range) => {
                            setDateRange(range);
                            setCurrentPage(0);
                          }}
                          numberOfMonths={2}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
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
                  <FieldLabel htmlFor="duracao">Duração</FieldLabel>
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
                      placeholder="NWT..."
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
