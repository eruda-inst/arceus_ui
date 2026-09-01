import {
  Table,
  Skeleton,
  Card,
  EmptyState,
  Chip,
  ChipProps,
} from "@heroui/react";
import {
  FaUser,
  FaEnvelope,
  FaCircleCheck,
  FaClock,
  FaCalendar,
  FaUsers,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import type { UserOut } from "@/types/user.type";
import { GroupOut } from "@/types/group.type";

interface UserTableProps {
  data: UserOut[];
  isLoading: boolean;
  onRowClick: (user: UserOut) => void;
  groups?: GroupOut[];
}

function ChipStatus({
  isActive,
  className,
  children,
  ...props
}: ChipProps & { isActive: boolean }) {
  const classColors = isActive
    ? "text-success-soft-foreground bg-success-soft"
    : "text-danger-soft-foreground bg-danger-soft";

  return (
    <Chip {...props} className={twMerge(classColors, className)}>
      {children}
    </Chip>
  );
}

function UserTable({ data, isLoading, onRowClick, groups }: UserTableProps) {
  const getGroupName = (id: number) => {
    const group = groups?.find((g) => g.id === id);
    return group?.nome || String(id);
  };

  if (isLoading) {
    return <Skeleton className="h-80 rounded-lg" />;
  }

  return (
    <Card className="p-0 border">
      <Card.Header className="p-4">
        <Card.Title>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-purple-700 to-indigo-700 rounded-lg">
              <FaUser className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Usuários</h2>
          </div>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <Table className="rounded-none p-0 max-h-195.5 overflow-auto">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Usuários"
              onRowAction={(key) => {
                const user = data.find((u) => u.id === Number(key));
                if (user) onRowClick(user);
              }}
            >
              <Table.Header className="sticky top-0 z-10">
                {/* Nome */}
                <Table.Column isRowHeader>
                  <div className="flex items-center gap-2 py-2">
                    <FaUser className="size-3.5" />
                    <span className="uppercase">Nome</span>
                  </div>
                </Table.Column>

                {/* Email */}
                <Table.Column>
                  <div className="flex items-center gap-2 py-2">
                    <FaEnvelope className="size-3.5" />
                    <span className="uppercase">Email</span>
                  </div>
                </Table.Column>

                {/* Status (Ativo/Inativo) */}
                <Table.Column>
                  <div className="flex items-center gap-2 py-2">
                    {true ? (
                      <FaCircleCheck className="size-3.5" />
                    ) : (
                      <FaClock className="size-3.5" />
                    )}
                    <span className="uppercase">Status</span>
                  </div>
                </Table.Column>

                {/* Grupo */}
                <Table.Column>
                  <div className="flex items-center gap-2 py-2">
                    <FaUsers className="size-3.5" />
                    <span className="uppercase">Grupo</span>
                  </div>
                </Table.Column>

                {/* Criado em */}
                <Table.Column>
                  <div className="flex items-center gap-2 py-2">
                    <FaCalendar className="size-3.5" />
                    <span className="uppercase">Criado em</span>
                  </div>
                </Table.Column>
              </Table.Header>

              <Table.Body
                renderEmptyState={() => (
                  <EmptyState className="text-center text-warning py-4">
                    Nenhum usuário encontrado
                  </EmptyState>
                )}
              >
                {data.map((user) => (
                  <Table.Row
                    key={user.id}
                    id={user.id.toString()}
                    className="hover:cursor-pointer"
                  >
                    {/* Nome */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold">{user.nome}</span>
                      </div>
                    </Table.Cell>

                    {/* Email */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaEnvelope className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold">{user.email}</span>
                      </div>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          {user.ativo ? (
                            <FaCircleCheck className="w-4 h-4 text-success-400" />
                          ) : (
                            <FaClock className="w-4 h-4 text-danger-400" />
                          )}
                        </div>
                        <ChipStatus isActive={user.ativo}>
                          {user.ativo ? "Ativo" : "Inativo"}
                        </ChipStatus>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaUsers className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold">
                          {getGroupName(user.id_grupo)}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Criado em */}
                    <Table.Cell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                          <FaCalendar className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-semibold">
                          {new Date(user.criado_em).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
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

export default UserTable;
