"use client";

import { useCallback, useEffect, useState } from "react";
import { UserService } from "@/services/User";
import type { UserOut, UserPaginationOut } from "@/types/userType";
import UserTable from "@/components/Tables/User/User";
import { useUserFilter } from "@/stores/userFilterStore";
import ActiveUserFilters from "@/components/Filters/User/Active/Active";
import UserFilters from "@/components/Filters/User/Filter/Filter";
import { Button, toast } from "@heroui/react";
import Details from "@/components/Modals/User/Details/Details";
import { useUserStore } from "@/stores/userStore";
import PaginationControls from "@/components/PaginationControls/PaginationControls";
import Add from "@/components/Modals/User/Add/Add";
import { usePermissions } from "@/contexts/permissionContext";

function Users() {
  const { hasAllPermissions } = usePermissions();

  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  const getAll = UserService.getAll;
  const filters = useUserFilter((state) => state.filters);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPagination, setUserPagination] =
    useState<UserPaginationOut | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

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
        setUsers(result.dados);
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
    setPage(1);
  }, [filters]);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleRowClick = (user: UserOut) => {
    setIsDetailsOpen(true);
    setSelectedUser(user);
  };

  const totalItems = userPagination?.total_itens ?? 0;
  const totalPages = userPagination?.total_paginas ?? 1;

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
        <Button
          className="bg-linear-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
          size="md"
          onPress={() => setIsAddOpen(true)}
          isDisabled={!hasAllPermissions(["criar:usuarios"])}
        >
          Adicionar
        </Button>
      </div>

      <UserFilters />
      <ActiveUserFilters />

      {totalItems > 0 && (
        <div className="my-6">
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      <UserTable
        data={users}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      {selectedUser && (
        <Details
          isOpen={isDetailsOpen}
          user={selectedUser}
          handleClose={() => setIsDetailsOpen(false)}
        />
      )}

      <Add isOpen={isAddOpen} handleClose={() => setIsAddOpen(false)} />
    </div>
  );
}

export default Users;
