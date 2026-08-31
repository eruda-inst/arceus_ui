"use client";

import { useCallback, useEffect, useState } from "react";
import UserService from "@/services/User.service";
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
import { Button, Skeleton, toast } from "@heroui/react";
import usePagination from "@/hooks/usePagination.hook";
import useFilter from "@/hooks/useFilter.hook";

export default function Users() {
  const { hasAllPerms } = usePermStore();
  const { currentUser } = useAuthStore();
  const groups = useGroupStore((state) => state.groups);
  const setGroups = useGroupStore((state) => state.setGroups);

  const { filters, handleRemoveFilter, handleResetFilters, handleSetFilters } =
    useFilter<UserFilterIn>();

  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  const getAll = UserService.getAll;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPagination, setUserPagination] =
    useState<UserPaginationOut | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const {
    page,
    itemsPerPage,
    handleGoToPage,
    handleNextPage,
    handlePrevPage,
    handleSetItemsPerPage,
  } = usePagination();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await UserService.getAll({
        page,
        itemsPerPage,
        name: filters.name,
        email: filters.email,
        groupName: filters.groupName,
      });
      if (result) {
        setUsers(result.data);
        setUserPagination(result);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.danger("Erro ao buscar usuários");
    } finally {
      setIsLoading(false);
    }
  }, [page, itemsPerPage, filters, getAll]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    GroupService.getAll().then((data) => {
      if (data) setGroups(data);
    });
  }, []);

  const handleRowClick = (user: UserOut) => {
    setIsDetailsOpen(true);
    setSelectedUser(user);
  };

  const totalItems = userPagination?.meta?.total_itens ?? 0;
  const totalPages = userPagination?.meta?.total_paginas ?? 1;

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
        </div>

        {currentUser ? (
          <Button
            className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
            size="md"
            onPress={() => setIsAddOpen(true)}
            isDisabled={!hasAllPerms(["criar:usuarios"])}
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
        data={users}
        isLoading={isLoading}
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
