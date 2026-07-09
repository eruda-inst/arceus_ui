import {
  Table,
  Skeleton,
  Card,
  EmptyState,
  Chip,
  ChipProps,
  Button,
} from "@heroui/react";
import {
  FaServer,
  FaStackExchange,
  FaLink,
  FaHashtag,
  FaCalendar,
  FaClock,
} from "react-icons/fa6";
import { Code, LogOut, Method } from "@/types/log.type";
import Formatter from "@/helpers/Formatter";
import { twMerge } from "tailwind-merge";

interface LogTableProps {
  data: LogOut[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefreshLogs: () => {};
  onRowClick: (data: LogOut) => void;
}

interface ChipMethodProps extends ChipProps {
  method: Method;
}

interface ChipCodeProps extends ChipProps {
  code: Code;
}

function ChipMethod({
  method,
  className,
  children,
  ...props
}: ChipMethodProps) {
  let classColors = "";

  if (method === "POST") {
    classColors = "text-success-soft-foreground bg-success-soft";
  }

  if (method === "PUT") {
    classColors = "text-warning-soft-foreground bg-warning-soft";
  }

  if (method === "GET") {
    classColors = "text-accent-soft-foreground bg-accent-soft";
  }

  return (
    <Chip {...props} className={twMerge(classColors, className)}>
      {children}
    </Chip>
  );
}

function ChipCode({ code, className, children, ...props }: ChipCodeProps) {
  let classColors = "";

  if (code < 300) {
    classColors = "text-success-soft-foreground bg-success-soft";
  } else if (code < 500) {
    classColors = "text-warning-soft-foreground bg-warning-soft";
  } else {
    classColors = "text-danger-soft-foreground bg-danger-soft";
  }

  return (
    <Chip {...props} className={twMerge(classColors, className)}>
      {children}
    </Chip>
  );
}

function LogTable({
  data,
  isLoading,
  isRefreshing,
  onRefreshLogs,
  onRowClick,
}: LogTableProps) {
  if (isLoading) {
    return <Skeleton className="h-80 rounded-lg" />;
  }

  return (
    <Card className="p-0">
      <Card.Header className="p-4">
        <Card.Title className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg bg-linear-to-r from-purple-700 to-indigo-700">
              <FaServer className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Registros de requisições
            </h2>
          </div>
          <Button
            className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
            onPress={onRefreshLogs}
            size="md"
            isPending={isRefreshing}
            isDisabled={isLoading || isRefreshing}
          >
            {({ isPending }) => (isPending ? "Atualizado..." : "Atualizar")}
          </Button>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <Table className="rounded-none p-0 max-h-195.5 overflow-auto">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Registros de requisições"
              onRowAction={(key) => {
                const log = data.find((l) => l.id === key);
                if (log) onRowClick(log);
              }}
            >
              <Table.Header className="sticky top-0 z-10">
                {/* IP */}
                {/* <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaServer className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 uppercase">IP</span>
                  </div>
                </Table.Column> */}

                {/* Método */}
                <Table.Column>
                  <div className="flex items-center gap-2">
                    <FaStackExchange className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300 uppercase">Método</span>
                  </div>
                </Table.Column>

                {/* Endpoint */}
                <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaLink className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 uppercase">Endpoint</span>
                  </div>
                </Table.Column>

                {/* Código */}
                <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaHashtag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 uppercase">Código</span>
                  </div>
                </Table.Column>

                {/* Data */}
                <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaCalendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 uppercase">Data</span>
                  </div>
                </Table.Column>

                {/* Hora */}
                <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaClock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 uppercase">Hora</span>
                  </div>
                </Table.Column>
              </Table.Header>

              <Table.Body
                renderEmptyState={() => (
                  <EmptyState className="text-center text-warning py-4">
                    Nenhum log encontrado
                  </EmptyState>
                )}
              >
                {data.map((log) => (
                  <Table.Row
                    key={log.id}
                    id={log.id}
                    className="hover:cursor-pointer"
                  >
                    {/* IP */}
                    {/* <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaServer className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-100 font-mono">
                          {log.ip}
                        </span>
                      </div>
                    </Table.Cell> */}

                    {/* Método */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaStackExchange className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-100">
                          <ChipMethod method={log.metodo as Method}>
                            {log.metodo}
                          </ChipMethod>
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Endpoint */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaLink className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span
                          className="font-semibold text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-75"
                          title={log.endpoint}
                        >
                          {log.endpoint}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Código */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaHashtag className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-100">
                          <ChipCode code={log.codigo as Code}>
                            {log.codigo}
                          </ChipCode>
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Data */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaCalendar className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-100">
                          {Formatter.isoDate(log.data)}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Hora */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaClock className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-gray-100">
                          {Formatter.isoHour(log.hora)}
                        </span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
    </Card>
  );
}

export default LogTable;
