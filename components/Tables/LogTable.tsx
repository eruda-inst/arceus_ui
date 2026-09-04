import { Table, Skeleton, EmptyState, Chip } from "@heroui/react";
import {
  FaStackExchange,
  FaLink,
  FaHashtag,
  FaCalendar,
  FaClock,
} from "react-icons/fa6";
import { LogOutType } from "@/types/log.type";
import Formatter from "@/helpers/Formatter.helper";

export interface LogTableProps {
  logs?: LogOutType[];
  isLoading: boolean;
  onRowClick: (user: LogOutType) => void;
}

export default function LogTable({
  logs,
  isLoading,
  onRowClick,
}: LogTableProps) {
  if (isLoading) {
    return <Skeleton className="h-80 rounded-2xl" />;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Logs"
          onRowAction={(key) => {
            const log = logs?.find((u) => u.id === key);
            if (log) onRowClick(log);
          }}
        >
          <Table.Header className="sticky top-0 z-10">
            {/* Método HTTP */}
            <Table.Column isRowHeader>
              <div className="flex items-center gap-2 py-2">
                <FaStackExchange className="size-3.5" />
                <span className="uppercase">Método HTTP</span>
              </div>
            </Table.Column>

            {/* Endpoint */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaLink className="size-3.5" />
                <span className="uppercase">Endpoint</span>
              </div>
            </Table.Column>

            {/* Código HTTP */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaHashtag className="size-3.5" />
                <span className="uppercase">Código HTTP</span>
              </div>
            </Table.Column>

            {/* Data */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaCalendar className="size-3.5" />
                <span className="uppercase">Data de registro</span>
              </div>
            </Table.Column>

            {/* Hora */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaClock className="size-3.5" />
                <span className="uppercase">Hora de registro</span>
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
            {logs?.map(({ id, codigo, criado_em, endpoint, metodo }) => (
              <Table.Row id={id} key={id} className="hover:cursor-pointer">
                {/* Método HTTP */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaStackExchange className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">
                      {metodo === "POST" && (
                        <Chip color="success" variant="soft">
                          {metodo}
                        </Chip>
                      )}
                      {metodo === "PUT" && (
                        <Chip color="warning" variant="soft">
                          {metodo}
                        </Chip>
                      )}
                      {metodo === "GET" && (
                        <Chip color="accent" variant="soft">
                          {metodo}
                        </Chip>
                      )}
                    </span>
                  </div>
                </Table.Cell>

                {/* Endpoint */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaLink className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">{endpoint}</span>
                  </div>
                </Table.Cell>

                {/* Código HTTP */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaHashtag className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">
                      {codigo >= 200 && codigo <= 299 && (
                        <Chip color="success" variant="soft">
                          {codigo}
                        </Chip>
                      )}
                      {codigo >= 400 && codigo <= 499 && (
                        <Chip color="warning" variant="soft">
                          {codigo}
                        </Chip>
                      )}
                      {codigo >= 500 && codigo <= 599 && (
                        <Chip color="danger" variant="soft">
                          {codigo}
                        </Chip>
                      )}
                    </span>
                  </div>
                </Table.Cell>

                {/* Data de registro */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaCalendar className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">
                      {Formatter.isoDatetimeToDate(criado_em)}
                    </span>
                  </div>
                </Table.Cell>

                {/* Hora de registro */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaClock className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">
                      {Formatter.isoDatetimeToTime(criado_em)}
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
