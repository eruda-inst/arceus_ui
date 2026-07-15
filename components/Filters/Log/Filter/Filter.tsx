import { useState, useEffect } from "react";
import { Time, parseDate } from "@internationalized/date";
import {
  Button,
  TimeField,
  InputGroup,
  Select,
  ListBox,
  Label,
  TextField,
  DateField,
  FieldError,
  Accordion,
  Form,
  RangeCalendar,
  DateRangePicker,
  Card,
  toast,
} from "@heroui/react";
import {
  FaFilter,
  FaCalendar,
  FaServer,
  FaGlobe,
  FaUser,
  FaArrowRotateRight,
  FaMagnifyingGlass,
  FaCode,
  FaClock,
  FaFileCode,
} from "react-icons/fa6";
import z from "zod";
import { LogFilterIn } from "@/types/log.type";
import { useLogFilter } from "@/stores/logFilter.store";

const EmptyFilterSchema = z.object({
  metodo: z.undefined(),
  codigo: z.undefined(),
  protocolo: z.undefined(),
  data_inicio: z.undefined(),
  data_fim: z.undefined(),
  endpoint: z.undefined(),
  cliente: z.undefined(),
  setor: z.undefined(),
});

const Departments = [
  "Suporte",
  "Financeiro",
  "Comercial",
  "Triagem",
  "Cobrança",
  "Upgrade",
  "Vila",
] as const;

function LogFilters() {
  const filters = useLogFilter((state) => state.filters);
  const setFilters = useLogFilter((state) => state.setFilters);
  const resetFilters = useLogFilter((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState<LogFilterIn>(filters);
  const [isLocalFiltersEmpty, setIsLocalFiltersEmpty] = useState<boolean>(true);

  const handleChange = (
    key: keyof LogFilterIn,
    value?: string | number | boolean | null,
  ) => {
    const cleanValue =
      typeof value === "string" && value.trim() === "" ? undefined : value;
    setLocalFilters((prev) => ({ ...prev, [key]: cleanValue }));
  };

  const stringToTime = (timeString: string | undefined): Time | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Time(hours, minutes);
  };

  const timeToString = (time: Time | null): string | undefined => {
    if (!time) return undefined;
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({});
    toast.success("Filtros limpos com sucesso");
  };

  const handleApply = () => {
    setFilters(localFilters);
    toast.success("Filtros aplicados com sucesso");
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    setIsLocalFiltersEmpty(EmptyFilterSchema.safeParse(localFilters).success);
  }, [localFilters]);

  return (
    <Card className="mb-6">
      <Card.Header className="flex justify-between flex-row items-center">
        <div className="space-y-2">
          <Card.Title className="flex items-center gap-x-2">
            <div className="p-2 bg-linear-to-r from-purple-700 to-indigo-700 rounded-lg w-fit">
              <FaFilter className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-200">Filtros</div>
          </Card.Title>
          <Card.Description>
            Filtre os registros conforme necessário
          </Card.Description>
        </div>

        <div className="flex gap-3">
          <Button
            onPress={handleReset}
            isDisabled={isLocalFiltersEmpty}
            className="bg-linear-to-r from-gray-700 to-gray-800 text-gray-200 hover:shadow-md transition-shadow"
          >
            <FaArrowRotateRight className="size-4" /> Limpar
          </Button>
          <Button
            onPress={handleApply}
            isDisabled={isLocalFiltersEmpty}
            className="bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md transition-shadow"
          >
            <FaMagnifyingGlass className="size-4" /> Aplicar Filtros
          </Button>
        </div>
      </Card.Header>

      <Card.Content>
        <Accordion>
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
                    onChange={(value) => handleChange("metodo", value)}
                  >
                    <Label>Método</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {["GET", "POST", "PUT"].map((method) => (
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
                    value={
                      localFilters.codigo !== undefined
                        ? String(localFilters.codigo)
                        : ""
                    }
                    onChange={(value) =>
                      handleChange("codigo", value ? Number(value) : undefined)
                    }
                  >
                    <Label>Código</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {[200, 201, 400, 404, 405, 422, 500, 503].map(
                          (code) => (
                            <ListBox.Item key={code} id={String(code)}>
                              <Label>{code}</Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ),
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField
                    variant="secondary"
                    value={localFilters.endpoint ?? ""}
                    onChange={(value) => handleChange("endpoint", value)}
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
                    onChange={(value) => handleChange("protocolo", value)}
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
                  <TextField
                    variant="secondary"
                    value={localFilters.cliente ?? ""}
                    onChange={(value) => handleChange("cliente", value)}
                  >
                    <Label>Cliente</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <FaUser className="size-4 text-gray-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Postman, navegador..." />
                    </InputGroup>
                    <FieldError />
                  </TextField>

                  <Select
                    variant="secondary"
                    placeholder="Departamento"
                    value={localFilters.setor ?? ""}
                    onChange={(value) => handleChange("setor", value)}
                  >
                    <Label>Setor</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {Departments.map((dept) => (
                          <ListBox.Item key={dept} id={dept}>
                            <Label>{dept}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </Form>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

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
                      if (range) {
                        handleChange("data_inicio", range.start.toString());
                        handleChange("data_fim", range.end.toString());
                      } else {
                        handleChange("data_inicio", undefined);
                        handleChange("data_fim", undefined);
                      }
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
                    value={stringToTime(localFilters.hora_inicio)}
                    onChange={(time) =>
                      handleChange(
                        "hora_inicio",
                        time ? timeToString(time) : undefined,
                      )
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
                    value={stringToTime(localFilters.hora_fim)}
                    onChange={(time) =>
                      handleChange(
                        "hora_fim",
                        time ? timeToString(time) : undefined,
                      )
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

export default LogFilters;
