"use client";

import { useEffect, useState } from "react";
import type {
  UserFilterIn,
  UserOut,
  UserPaginationOut,
} from "@/types/user.type";
import UserTable from "@/components/Tables/UserTable";
import ActiveUserFilters from "@/components/Filters/ActiveUserFilters";
import UserFilters from "@/components/Filters/UserFilters";
import Details from "@/components/Modals/UserDetails";
import { useUserStore } from "@/stores/user.store";
import PaginationControls from "@/components/PaginationControls";
import Add from "@/components/Modals/UserAdd";
import { useAuthStore } from "@/stores/authentication.store";
import GroupService from "@/services/Group.service";
import { useGroupStore } from "@/stores/group.store";
import { usePermStore } from "@/stores/perm.store";
import { Button, ColorSwatch, Skeleton } from "@heroui/react";
import usePagination from "@/hooks/usePagination.hook";
import useFilter from "@/hooks/useFilter.hook";
import { API_ROUTES } from "@/configs/api.config";
import useUserWebSocket from "@/hooks/useUserWebSocket.hook";
import { clsx } from "clsx";

export default function Users() {
  const { isConnected, lastMessage, isConnecting, sendMessage } =
    useUserWebSocket({ url: API_ROUTES.userWs });

  const { hasPerm } = usePermStore();
  const { currentUser } = useAuthStore();
  const groups = useGroupStore((state) => state.groups);
  const setGroups = useGroupStore((state) => state.setGroups);

  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<UserFilterIn>();

  const setUsers = useUserStore((state) => state.setUsers);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  useEffect(() => {
    if (lastMessage?.data) {
      setUsers(lastMessage.data);
    }
  }, [lastMessage]);

  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  useEffect(() => {
    GroupService.getAll().then((data) => {
      if (data) setGroups(data);
    });
  }, []);

  const handleRowClick = (user: UserOut) => {
    setIsDetailsOpen(true);
    setSelectedUser(user);
  };

  useEffect(() => {
    sendMessage({ pagina: page, itens_por_pagina: itemsPerPage, ...filters });
  }, [itemsPerPage, sendMessage, page, filters]);

  const totalItems = lastMessage?.meta?.total_itens ?? 0;
  const totalPages = lastMessage?.meta?.total_paginas ?? 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Usuários
          </h1>
          <p className="text-gray-400 mt-1">
            Visualize, adicione, remova, inative e reative usuários do IXC
          </p>
          <span
            className={clsx(
              "flex items-center gap-x-2",
              isConnecting
                ? "text-blue-500"
                : isConnected
                  ? "text-green-500"
                  : "text-red-500",
            )}
          >
            {isConnecting
              ? "Conectando..."
              : isConnected
                ? "Conectado"
                : "Desconectado"}
            <ColorSwatch
              className="animate-pulse"
              size="xs"
              color={isConnecting ? "#00f" : isConnected ? "#0f0" : "#f00"}
            />
          </span>
        </div>

        {currentUser ? (
          <Button
            className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
            size="md"
            onPress={() => setIsAddOpen(true)}
            isDisabled={!hasPerm("criar:usuarios")}
          >
            Adicionar
          </Button>
        ) : (
          <Skeleton className="rounded-3xl w-30 h-10" />
        )}
      </div>

      <UserFilters
        filters={filters}
        onResetFilters={handleResetFilters}
        onSetFilters={handleSetFilters}
      />

      <ActiveUserFilters
        filters={filters}
        onRemoveFilters={handleRemoveFilter}
        onResetFilters={handleResetFilters}
      />

      {totalItems > 0 && (
        <div className="my-6">
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onGoToPage={handleGoToPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onSetItemsPerPage={handleSetItemsPerPage}
          />
        </div>
      )}

      <UserTable
        data={lastMessage?.data}
        isLoading={!lastMessage}
        onRowClick={handleRowClick}
        groups={groups}
      />

      {selectedUser && (
        <Details
          isOpen={isDetailsOpen}
          user={selectedUser}
          onOpenChange={setIsDetailsOpen}
          handleClose={() => setIsDetailsOpen(false)}
        />
      )}

      <Add
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        handleClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
