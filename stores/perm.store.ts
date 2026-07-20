import { create } from "zustand";
import { PermissionOut } from "@/types/perm.type";
import { PermissionService } from "@/services/Permission";

interface PermissionStore {
  permissions: PermissionOut[];
  isLoading: boolean;
  error: string | null;
  userId: number | null;
  setUserId: (userId: number | null) => void;
  fetchPermissions: (userId: number) => Promise<void>;
  refreshPermissions: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  hasAllPermissions: (permissionCodes: string[]) => boolean;
  reset: () => void;
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  permissions: [],
  isLoading: false,
  error: null,
  userId: null,

  setUserId: (userId) => set({ userId }),

  fetchPermissions: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const perms = await PermissionService.getByUserId(userId);
      set({ permissions: perms, isLoading: false });
    } catch (err) {
      set({ error: "Erro ao buscar permissões", isLoading: false });
      throw err;
    }
  },

  refreshPermissions: async () => {
    const { userId } = get();
    if (!userId) {
      set({ permissions: [], error: null });
      return;
    }
    await get().fetchPermissions(userId);
  },

  hasPermission: (permissionCode) =>
    get().permissions.some((perm) => perm.codigo === permissionCode),

  hasAnyPermission: (permissionCodes) =>
    permissionCodes.some((code) => get().hasPermission(code)),

  hasAllPermissions: (permissionCodes) =>
    permissionCodes.every((code) => get().hasPermission(code)),

  reset: () =>
    set({ permissions: [], isLoading: false, error: null, userId: null }),
}));
