"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Typography } from "@heroui/react";
import ConnectionIndicatior from "@/components/ConnectionIndicatior";
import PaginationControls from "@/components/PaginationControls";
import UserFilters from "@/components/Filters/UserFilters";
import ActiveFilters from "@/components/Filters/ActiveFilters";
import Details from "@/components/Modals/UserDetails";
import UserTable from "@/components/Tables/UserTable";
import Add from "@/components/Modals/UserAdd";
import { useAuthStore } from "@/stores/auth.store";
import useWs from "@/hooks/useWs.hook";
import usePagination from "@/hooks/usePagination.hook";
import useFilter from "@/hooks/useFilter.hook";
import {
  UserFilterInType,
  UserListOutType,
  UserOutType,
  UserParamsInType,
} from "@/types/user.type";
import { API_ROUTES } from "@/configs/api.config";

/**
 * Users page component for managing system users.
 * It uses a WebSocket connection to receive real-time user data,
 * supports filtering and pagination, and provides modals for viewing details and adding new users.
 */
export default function UsersPage() {
  // State for details modal visibility and selected user.
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  // State for "Add user" modal visibility.
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  // Currently selected user ID for details modal.
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Permission check: user must have "criar:usuarios" permission to see the "New user" button.
  const hasPerm = useAuthStore((state) => state.hasPerm);

  // Access token used to authenticate the users WebSocket connection
  const token = useAuthStore((state) => state.accessToken);

  // Pagination state and handlers.
  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  // Filter state and handlers.
  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<UserFilterInType>();

  // WebSocket connection that streams paginated, filtered user data.
  // The initial message sends the current page, items-per-page, and any
  // active filters; later changes are propagated by calling `sendMessage`
  // inside the pagination/filter effect below.
  const {
    lastMessage: users,
    isConnected,
    isConnecting,
    sendMessage,
  } = useWs<UserParamsInType, UserListOutType>({
    url: API_ROUTES.userWs(),
    token: token ?? "",
    initialMessage: () => ({
      pagina: page,
      itens_por_pagina: itemsPerPage,
      ...filters,
    }),
  });

  /**
   * Selected user derived from the current WebSocket array.
   * Only the id is kept in state; the object is recomputed whenever the
   * list changes, so the modal automatically reflects real-time updates
   * without needing extra state.
   */
  const selectedUser = useMemo(
    () => users?.data.find((u) => u.id === selectedUserId) ?? null,
    [users?.data, selectedUserId],
  );

  /**
   * Handler for table row click.
   * Sets the selected user and opens the details modal.
   */
  const handleRowClick = (user: UserOutType) => {
    setSelectedUserId(user.id);
    setIsDetailsOpen(true);
  };

  /**
   * Effect that sends a WebSocket message whenever pagination or filters change.
   * This fetches the appropriate page of users matching the current criteria.
   */
  useEffect(() => {
    sendMessage({
      pagina: page,
      itens_por_pagina: itemsPerPage,
      ...filters,
    });
  }, [itemsPerPage, sendMessage, page, filters]);

  return (
    <div className="container mx-auto p-2 space-y-6">
      {/* Header: title, description, connection status, and "New user" button */}
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

        {/* Add user button – only enabled if user has the required permission */}
        <Button
          isDisabled={!hasPerm("criar:usuarios")}
          onPress={() => setIsAddOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          Novo usuário
        </Button>
      </div>

      {/* Filter builder component */}
      <UserFilters
        filters={filters}
        onResetFilters={handleResetFilters}
        onSetFilters={handleSetFilters}
      />

      {/* Displays currently active filters */}
      <ActiveFilters
        filters={filters}
        onResetFilters={handleResetFilters}
        onRemoveFilters={handleRemoveFilter}
        labelMap={{
          nome: "Nome",
          email: "Email",
          nome_grupo: "Nome do grupo",
          ativo: "Ativo",
        }}
      />

      {/* Pagination controls */}
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

      {/* User table – shows loading state until data arrives */}
      <UserTable
        users={users?.data}
        isLoading={!users}
        onRowClick={handleRowClick}
      />

      {/* Details modal – only rendered when a user is selected */}
      {selectedUser && (
        <Details
          user={selectedUser}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedUserId(null); // selectedUser becomes null → Details unmounts
          }}
        />
      )}

      {/* Add user modal */}
      <Add
        addedUsers={users?.data || []}
        isOpen={isAddOpen}
        handleClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
