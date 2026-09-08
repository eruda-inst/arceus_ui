import { useMemo, useState } from "react";
import { parseDate, parseTime } from "@internationalized/date";
import {
  Accordion,
  Button,
  Card,
  DateField,
  DateRangePicker,
  FieldError,
  Form,
  InputGroup,
  Label,
  ListBox,
  RangeCalendar,
  Select,
  TextField,
  TimeField,
  toast,
} from "@heroui/react";
import {
  FaCalendar,
  FaClock,
  FaCode,
  FaFileCode,
  FaFilter,
  FaGlobe,
  FaServer,
  FaUser,
} from "react-icons/fa6";
import {
  HTTPMethodType,
  HTTPStatusCodeType,
  LogFilterInType,
  SectorType,
} from "@/types/log.type";

// Predefined options for filter dropdowns
export const methods: HTTPMethodType[] = [
  "GET",
  "DELETE",
  "PATCH",
  "POST",
  "PUT",
];

export const statusCodes: HTTPStatusCodeType[] = [
  200, 201, 401, 403, 404, 422, 500,
];

export const sectors: SectorType[] = [
  "Cobrança",
  "Comercial",
  "Financeiro",
  "Suporte",
  "Triagem",
  "Upgrade",
  "Vila",
];

export interface LogFiltersProps {
  /** Current filter values from parent */
  filters: LogFilterInType;
  /** Callback to apply filters (send to parent) */
  onSetFilters: (filters: LogFilterInType) => void;
  /** Callback to reset all filters to empty */
  onResetFilters: () => void;
}

export default function LogFilters({
  filters,
  onSetFilters,
  onResetFilters,
}: LogFiltersProps) {
  // Local state for filter values before applying
  const [localFilters, setLocalFilters] = useState<LogFilterInType>(filters);

  // Determine if any filter is set (to enable/disable action buttons)
  const isFiltersEmpty = useMemo(() => {
    return !Object.keys(localFilters).length;
  }, [localFilters]);

  // Reset filters locally and notify parent
  const handleReset = () => {
    onResetFilters();
    setLocalFilters({});
    toast.success("Filtros limpos com sucesso");
  };

  // Apply current local filters to parent
  const handleApply = () => {
    onSetFilters(localFilters);
    toast.success("Filtros aplicados com sucesso");
  };

  return (
    <Card className="mb-6 border">
      <Card.Header className="flex justify-between flex-row items-center">
        <div className="space-y-2">
          <Card.Title className="flex items-center gap-x-2">
            <div className="p-2 bg-linear-to-r bg-indigo-500 rounded-lg w-fit">
              <FaFilter className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              Filtros
            </div>
          </Card.Title>
          <Card.Description>
            Filtre os registros conforme necessário
          </Card.Description>
        </div>

        <div className="flex gap-3">
          <Button
            onPress={handleReset}
            isDisabled={isFiltersEmpty}
            className="bg-linear-to-r from-gray-700 to-gray-800 text-gray-200 hover:shadow-md transition-shadow"
          >
            Limpar
          </Button>
          <Button
            onPress={handleApply}
            isDisabled={isFiltersEmpty}
            className="bg-linear-to-r bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-md transition-shadow"
          >
            Aplicar Filtros
          </Button>
        </div>
      </Card.Header>

      <Card.Content>
        {/* Accordion groups filter sections for better UX */}
        <Accordion>
          {/* Request section: HTTP method, status code, endpoint, protocol */}
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <div className="flex items-center gap-x-2">
                  <FaCode className="size-5" />
                  <span>Requisição</span>
                </div>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Form className="grid grid-cols-2 gap-4">
                  <Select
                    variant="secondary"
                    placeholder="Método HTTP"
                    value={localFilters.metodo ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        metodo: v as HTTPMethodType,
                      }))
                    }
                  >
                    <Label>Método</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {methods.map((method) => (
                          <ListBox.Item key={method} id={method}>
                            <Label>{method}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    variant="secondary"
                    placeholder="Código HTTP"
                    value={localFilters.codigo ? localFilters.codigo : ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        codigo: v as HTTPStatusCodeType,
                      }))
                    }
                  >
                    <Label>Código</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {statusCodes.map((statusCode) => (
                          <ListBox.Item
                            key={statusCode}
                            id={String(statusCode)}
                          >
                            <Label>{statusCode}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField
                    variant="secondary"
                    value={localFilters.endpoint ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, endpont: v }))
                    }
                  >
                    <Label>Endpoint</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaServer className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="/api/..." />
                    </InputGroup>
                    <FieldError />
                  </TextField>

                  <TextField
                    variant="secondary"
                    value={localFilters.protocolo ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, protocolo: v }))
                    }
                  >
                    <Label>Protocolo</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaFileCode className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="NWT2024123411" />
                    </InputGroup>
                    <FieldError />
                  </TextField>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Origin section: sector and client name */}
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <div className="flex items-center gap-x-2">
                  <FaGlobe className="size-5" />
                  <span>Origem</span>
                </div>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Form className="grid grid-cols-2 gap-4">
                  <Select
                    variant="secondary"
                    placeholder="Setor"
                    value={localFilters.setor ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        setor: v as SectorType,
                      }))
                    }
                  >
                    <Label>Setor</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {sectors.map((dept) => (
                          <ListBox.Item key={dept} id={dept}>
                            <Label>{dept}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField
                    variant="secondary"
                    value={localFilters.nome_cliente ?? ""}
                    onChange={(v) =>
                      setLocalFilters((prev) => ({ ...prev, nome_cliente: v }))
                    }
                  >
                    <Label>Nome do cliente</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUser className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="John Doe" />
                    </InputGroup>
                    <FieldError />
                  </TextField>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Date section: date range picker */}
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <div className="flex items-center gap-x-2">
                  <FaCalendar className="size-5" />
                  <span>Data</span>
                </div>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Form className="grid grid-cols-2 gap-4">
                  <DateRangePicker
                    endName="endDate"
                    startName="startDate"
                    value={
                      localFilters.data_inicio && localFilters.data_fim
                        ? {
                            start: parseDate(localFilters.data_inicio),
                            end: parseDate(localFilters.data_fim),
                          }
                        : null
                    }
                    onChange={(range) => {
                      setLocalFilters((prev) => ({
                        ...prev,
                        data_inicio: range?.start.toString(),
                        data_fim: range?.end.toString(),
                      }));
                    }}
                  >
                    <Label>Intervalo de datas</Label>
                    <DateField.Group fullWidth variant="secondary">
                      <DateField.Input slot="start">
                        {(segment) => <DateField.Segment segment={segment} />}
                      </DateField.Input>
                      <DateRangePicker.RangeSeparator />
                      <DateField.Input slot="end">
                        {(segment) => <DateField.Segment segment={segment} />}
                      </DateField.Input>
                      <DateField.Suffix>
                        <DateRangePicker.Trigger>
                          <DateRangePicker.TriggerIndicator />
                        </DateRangePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DateRangePicker.Popover>
                      <RangeCalendar aria-label="Data dos logs">
                        <RangeCalendar.Header>
                          <RangeCalendar.YearPickerTrigger>
                            <RangeCalendar.YearPickerTriggerHeading />
                            <RangeCalendar.YearPickerTriggerIndicator />
                          </RangeCalendar.YearPickerTrigger>
                          <RangeCalendar.NavButton slot="previous" />
                          <RangeCalendar.NavButton slot="next" />
                        </RangeCalendar.Header>
                        <RangeCalendar.Grid>
                          <RangeCalendar.GridHeader>
                            {(day) => (
                              <RangeCalendar.HeaderCell>
                                {day}
                              </RangeCalendar.HeaderCell>
                            )}
                          </RangeCalendar.GridHeader>
                          <RangeCalendar.GridBody>
                            {(date) => <RangeCalendar.Cell date={date} />}
                          </RangeCalendar.GridBody>
                        </RangeCalendar.Grid>
                        <RangeCalendar.YearPickerGrid>
                          <RangeCalendar.YearPickerGridBody>
                            {({ year }) => (
                              <RangeCalendar.YearPickerCell year={year} />
                            )}
                          </RangeCalendar.YearPickerGridBody>
                        </RangeCalendar.YearPickerGrid>
                      </RangeCalendar>
                    </DateRangePicker.Popover>
                  </DateRangePicker>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Time section: start and end time fields */}
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <div className="flex items-center gap-x-2">
                  <FaClock className="size-5" />
                  <span>Hora</span>
                </div>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Form className="grid grid-cols-2 gap-4">
                  <TimeField
                    value={
                      localFilters.hora_inicio
                        ? parseTime(localFilters.hora_inicio)
                        : null
                    }
                    onChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        hora_inicio: v?.toString(),
                      }))
                    }
                  >
                    <Label>Hora início</Label>
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>

                  <TimeField
                    value={
                      localFilters.hora_fim
                        ? parseTime(localFilters.hora_fim)
                        : null
                    }
                    onChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        hora_fim: v?.toString(),
                      }))
                    }
                  >
                    <Label>Hora fim</Label>
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card.Content>
    </Card>
  );
}
