import { create } from "zustand";
import { PermOut } from "@/types/perm.type";
import PermService from "@/services/Perm.service";

export interface PermStore {
  perms: PermOut[];
  isLoading: boolean;
  error: string | null;
  userId: number | null;
  setUserId: (userId: number | null) => void;
  fetchPerms: (userId: number) => Promise<void>;
  hasAllPerms: (permCodes: string[]) => boolean;
}

export const usePermStore = create<PermStore>((set, get) => ({
  perms: [],
  isLoading: false,
  error: null,
  userId: null,
  setUserId: (userId) => set({ userId }),
  fetchPerms: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const perms = await PermService.getByUserId(userId);
      set({ perms: perms, isLoading: false });
    } catch (err) {
      set({ error: "Erro ao buscar permissões", isLoading: false });
      throw err;
    }
  },
  hasAllPerms: (permCodes) =>
    permCodes.every((permCode) =>
      get().perms.some((perm) => perm.codigo === permCode),
    ),
}));
