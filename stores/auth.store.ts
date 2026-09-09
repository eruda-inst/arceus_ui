import { redirect } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import PermService from "@/services/Perm.service";
import GroupService from "@/services/Group.service";
import { UserOutType } from "@/types/user.type";
import { PermOutType } from "@/types/perm.type";
import { GroupOutType } from "@/types/group.type";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const TOKEN_EXPIRY_KEY = "token_expiry";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  currentUser: UserOutType | null;
  loadingUser: boolean;
  userError: string | null;

  perms: PermOutType[];
  loadingPerms: boolean;
  permError: string | null;

  groups: GroupOutType[];
  loadingGroups: boolean;
  groupsError: string | null;

  init: () => Promise<void>;
  setTokens: (access: string, refresh: string, expiresIn?: number) => void;
  clearTokens: () => void;
  fetchCurrentUser: () => Promise<UserOutType | null>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;

  fetchPermissions: (userId: number) => Promise<void>;
  hasPerm: (permCode: string) => boolean;
  hasAllPerms: (permCodes: string[]) => boolean;

  fetchGroups: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  currentUser: null,
  loadingUser: false,
  userError: null,

  perms: [],
  loadingPerms: false,
  permError: null,

  groups: [],
  loadingGroups: false,
  groupsError: null,

  init: async () => {
    const access = getCookie(ACCESS_TOKEN_KEY) as string | undefined;
    const refresh = getCookie(REFRESH_TOKEN_KEY) as string | undefined;

    if (access) {
      set({
        accessToken: access,
        refreshToken: refresh || null,
        isAuthenticated: true,
      });
      await get().fetchCurrentUser();
      if (get().isAuthenticated) {
        await get().fetchGroups();
      }
    } else {
      set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    }
  },

  setTokens: (access, refresh, expiresIn = 3600) => {
    const cookieOptions = {
      maxAge: expiresIn,
      path: "/",
      secure: false,
      sameSite: "strict" as const,
    };
    setCookie(ACCESS_TOKEN_KEY, access, cookieOptions);
    setCookie(REFRESH_TOKEN_KEY, refresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });

    const expiry = new Date(Date.now() + expiresIn * 1000).toISOString();
    setCookie(TOKEN_EXPIRY_KEY, expiry, cookieOptions);

    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  clearTokens: () => {
    deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
    deleteCookie(REFRESH_TOKEN_KEY, { path: "/" });
    deleteCookie(TOKEN_EXPIRY_KEY, { path: "/" });
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      currentUser: null,
      perms: [],
      groups: [],
    });
  },

  fetchCurrentUser: async () => {
    const token = get().accessToken || (getCookie(ACCESS_TOKEN_KEY) as string);
    if (!token) return null;

    set({ loadingUser: true, userError: null });
    try {
      const response = await axiosClient.get<UserOutType>(
        API_ROUTES.auth.getMe(),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = response.data;
      set({ currentUser: user, isAuthenticated: true, loadingUser: false });

      if (user.id) {
        await get().fetchPermissions(user.id);
      }

      return user;
    } catch {
      set({
        userError: "Erro ao carregar usuário",
      });
      set({ loadingUser: false });
      return null;
    }
  },

  logout: async () => {
    get().clearTokens();
    if (typeof window !== "undefined") {
      redirect("/login");
    }
  },

  refreshTokens: async () => {
    const refresh =
      get().refreshToken || (getCookie(REFRESH_TOKEN_KEY) as string);
    if (!refresh) {
      await get().logout();
      return false;
    }

    try {
      const response = await axiosClient.post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>(
        API_ROUTES.auth.refreshToken(),
        { refresh_token: refresh },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const { access_token, refresh_token, expires_in } = response.data;
      get().setTokens(access_token, refresh_token, expires_in);

      await get().fetchCurrentUser();
      if (get().isAuthenticated) {
        await get().fetchGroups();
      }

      return true;
    } catch {
      await get().logout();
      return false;
    }
  },

  fetchPermissions: async (userId: number) => {
    set({ loadingPerms: true, permError: null });
    try {
      const perms = await PermService.getByUserId(userId);
      set({ perms, loadingPerms: false });
    } catch (err) {
      set({ permError: "Erro ao buscar permissões", loadingPerms: false });
      throw err;
    }
  },

  hasPerm: (permCode: string) =>
    get().perms.some((perm) => perm.codigo === permCode),

  hasAllPerms: (permCodes: string[]) =>
    permCodes.every((permCode) =>
      get().perms.some((perm) => perm.codigo === permCode),
    ),

  fetchGroups: async () => {
    set({ loadingGroups: true, groupsError: null });
    try {
      const groups = await GroupService.getAll();
      set({ groups: groups || [], loadingGroups: false });
    } catch (err) {
      set({
        groupsError: "Erro ao carregar grupos",
        loadingGroups: false,
      });
      throw err;
    }
  },
}));
