import { create } from "zustand";
import { PermOut } from "@/types/perm.type";
import { PermService } from "@/services/Perm";

interface PermStore {
  perms: PermOut[];
  isLoading: boolean;
  error: string | null;
  userId: number | null;
  setUserId: (userId: number | null) => void;
  fetchPerms: (userId: number) => Promise<void>;
  refreshPerms: () => Promise<void>;
  hasPerm: (permCode: string) => boolean;
  hasAnyPerm: (permCodes: string[]) => boolean;
  hasAllPerms: (permCodes: string[]) => boolean;
  reset: () => void;
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

  refreshPerms: async () => {
    const { userId } = get();
    if (!userId) {
      set({ perms: [], error: null });
      return;
    }
    await get().fetchPerms(userId);
  },

  hasPerm: (permCode) =>
    get().perms.some((perm) => perm.codigo === permCode),

  hasAnyPerm: (permCodes) =>
    permCodes.some((code) => get().hasPerm(code)),

  hasAllPerms: (permCodes) =>
    permCodes.every((code) => get().hasPerm(code)),

  reset: () =>
    set({ perms: [], isLoading: false, error: null, userId: null }),
}));
