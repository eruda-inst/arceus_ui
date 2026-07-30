import { create } from "zustand";
import { UserOut, UserUpdate } from "@/types/user.type";

type UserStore = {
  // Users
  users: UserOut[];
  setUsers: (data: UserOut[]) => void;

  // User
  addUser: (data: UserOut) => void;

  // Selected user
  selectedUser: UserOut | null;
  setSelectedUser: (data: UserOut) => void;
  updateSelectedUser: (data: UserUpdate) => void;
  deleteSelectedUser: () => void;
  toggleSelectedUserStatus: () => void;
};

const useUserStore = create<UserStore>()((set) => ({
  // Users
  users: [],
  setUsers: (data: UserOut[]) => set({ users: data }),

  // User
  addUser: (data: UserOut) =>
    set((state) => ({ users: [...state.users, data] })),

  // Selected user
  selectedUser: null,
  setSelectedUser: (data: UserOut) => set({ selectedUser: data }),
  updateSelectedUser: (data: UserUpdate) => {
    set((state) => {
      if (!state.selectedUser) {
        return {};
      }
      const updatedUser = { ...state.selectedUser, ...data };
      const updatedUsers = state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      );
      return {
        selectedUser: updatedUser,
        users: updatedUsers,
      };
    });
  },
  deleteSelectedUser: () => {
    set((state) => ({
      selectedUser: null,
      users: state.users.filter((user) => user.id !== state.selectedUser?.id),
    }));
  },
  toggleSelectedUserStatus: () => {
    set((state) => {
      if (!state.selectedUser) return {};
      const toggledStatus = !state.selectedUser.ativo;
      const updatedUser = { ...state.selectedUser, ativo: toggledStatus };
      const updatedUsers = state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      );
      return {
        selectedUser: updatedUser,
        users: updatedUsers,
      };
    });
  },
}));

export { useUserStore };
