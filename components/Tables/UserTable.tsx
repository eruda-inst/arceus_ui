import { Table, Skeleton, EmptyState, Chip } from "@heroui/react";
import {
  FaUser,
  FaEnvelope,
  FaCircleCheck,
  FaCalendar,
  FaUsers,
} from "react-icons/fa6";
import type { UserOutType } from "@/types/user.type";
import Formatter from "@/helpers/Formatter.helper";

interface UserTableProps {
  users?: UserOutType[];
  isLoading: boolean;
  onRowClick: (user: UserOutType) => void;
}

export default function UserTable({
  users,
  isLoading,
  onRowClick,
}: UserTableProps) {
  if (isLoading) {
    return <Skeleton className="h-80 rounded-2xl" />;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Usuários"
          onRowAction={(key) => {
            const user = users?.find((u) => u.id === key);
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

            {/* E-mail */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaEnvelope className="size-3.5" />
                <span className="uppercase">E-mail</span>
              </div>
            </Table.Column>

            {/* Status (Ativo/Inativo) */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaCircleCheck className="size-3.5" />
                <span className="uppercase">Status</span>
              </div>
            </Table.Column>

            {/* Nome do grupo */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaUsers className="size-3.5" />
                <span className="uppercase">Grupo</span>
              </div>
            </Table.Column>

            {/* Data de criação */}
            <Table.Column>
              <div className="flex items-center gap-2 py-2">
                <FaCalendar className="size-3.5" />
                <span className="uppercase">Data de criação</span>
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
            {users?.map(({ id, nome, email, ativo, nome_grupo, criado_em }) => (
              <Table.Row id={id} key={id} className="hover:cursor-pointer">
                {/* Nome */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaUser className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">{nome}</span>
                  </div>
                </Table.Cell>

                {/* E-mail */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaEnvelope className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">{email}</span>
                  </div>
                </Table.Cell>

                {/* Status (Ativo/Inativo) */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaCircleCheck className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">
                      {ativo ? (
                        <Chip color="success">Ativo</Chip>
                      ) : (
                        <Chip color="warning">Inativo</Chip>
                      )}
                    </span>
                  </div>
                </Table.Cell>

                {/* Nome do grupo */}
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <FaUsers className="size-4 text-white" />
                    </div>

                    <span className="font-semibold">{nome_grupo}</span>
                  </div>
                </Table.Cell>

                {/* Data de criação */}
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
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
