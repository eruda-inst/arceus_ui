import { create } from "zustand";
import { UserOut, UserUpdate } from "@/types/userType";

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
  inactivateSelectedUser: () => void;
  reactivateSelectedUser: () => void;
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
  inactivateSelectedUser: () => {
    set((state) => ({
      selectedUser: state.selectedUser
        ? { ...state.selectedUser, ativo: false }
        : null,
      users: state.users.map((user) =>
        user.id === state.selectedUser?.id ? { ...user, ativo: false } : user,
      ),
    }));
  },
  reactivateSelectedUser: () => {
    set((state) => ({
      selectedUser: state.selectedUser
        ? { ...state.selectedUser, ativo: true }
        : null,
      users: state.users.map((user) =>
        user.id === state.selectedUser?.id ? { ...user, ativo: true } : user,
      ),
    }));
  },
}));

export { useUserStore };
