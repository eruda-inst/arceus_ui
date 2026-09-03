"use client";

import { useEffect, useState } from "react";
import { Button, Typography } from "@heroui/react";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";
import PaginationControls from "@/components/PaginationControls";
import UserFilters from "@/components/Filters/UserFilters";
import ActiveUserFilters from "@/components/Filters/ActiveUserFilters";
import Details from "@/components/Modals/UserDetails";
import UserTable from "@/components/Tables/UserTable";
import Add from "@/components/Modals/UserAdd";
import useUserWebSocket from "@/hooks/useUserWebSocket.hook";
import usePagination from "@/hooks/usePagination.hook";
import useFilter from "@/hooks/useFilter.hook";
import { usePermStore } from "@/stores/perm.store";
import { UserFilterIn, UserOut } from "@/types/user.type";
import { API_ROUTES } from "@/configs/api.config";

export default function Users() {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserOut | null>(null);

  const { hasPerm } = usePermStore();

  // WebSocket
  const {
    lastMessage: users,
    isConnected,
    isConnecting,
    sendMessage,
  } = useUserWebSocket({
    url: API_ROUTES.userWs,
  });

  // Pagination
  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  // Filters
  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<UserFilterIn>();

  const handleRowClick = (user: UserOut) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleRefreshUser = () => {
    setSelectedUser((prev) => (prev ? { ...prev, ativo: !prev.ativo } : prev));
  };

  useEffect(() => {
    sendMessage({
      pagina: page,
      itens_por_pagina: itemsPerPage,
      ...filters,
    });
  }, [itemsPerPage, sendMessage, page, filters]);

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography
            type="h2"
            className="bg-linear-to-r from-purple-500 to-indigo-500 w-fit text-transparent bg-clip-text"
          >
            Usuários
          </Typography>

          <p className="text-muted">Visualize informações dos usuários</p>
          <p className="text-warning-soft-foreground">
            As informações são atualizadas automaticamente, não é necessário
            recarregar a página
          </p>

          <ConnectionIndicatior
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </div>

        <Button
          className="bg-indigo-500 hover:bg-indigo-600"
          onPress={() => setIsAddOpen(true)}
          isDisabled={!hasPerm("criar:usuarios")}
        >
          Novo usuário
        </Button>
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

      <PaginationControls
        page={page}
        totalPages={users?.meta?.total_paginas || 1}
        totalItems={users?.meta?.total_itens || 0}
        itemsPerPage={itemsPerPage}
        onGoToPage={handleGoToPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onSetItemsPerPage={handleSetItemsPerPage}
      />

      <UserTable
        users={users?.data}
        isLoading={!users}
        onRowClick={handleRowClick}
      />

      {selectedUser && (
        <Details
          onRefreshUser={handleRefreshUser}
          user={selectedUser}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      <Add
        addedUsers={users?.data || []}
        isOpen={isAddOpen}
        handleClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
