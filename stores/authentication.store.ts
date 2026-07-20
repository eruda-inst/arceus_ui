import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { UserOut } from "@/types/user.type";
import { GroupService } from "@/services/Group";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  currentUser: UserOut | null;
  loadingUser: boolean;
  userError: string | null;
  groupName: string | null;
  loadingGroup: boolean;

  // Ações
  init: () => Promise<void>;
  setTokens: (access: string, refresh: string, expiresIn?: number) => void;
  clearTokens: () => void;
  fetchCurrentUser: () => Promise<UserOut | null>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  setGroupName: (groupId: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  currentUser: null,
  loadingUser: false,
  userError: null,
  groupName: null,
  loadingGroup: false,

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
    } else {
      set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    }
  },

  setTokens: (access, refresh, expiresIn = 3600) => {
    const cookieOptions = {
      maxAge: expiresIn,
      path: "/",
      secure: process.env.NODE_ENV === "production",
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
      groupName: null,
    });
  },

  fetchCurrentUser: async () => {
    const token = get().accessToken || (getCookie(ACCESS_TOKEN_KEY) as string);
    if (!token) return null;

    set({ loadingUser: true, userError: null });
    try {
      const response = await axiosClient.get<UserOut>(
        API_ROUTES.authentication.getMe(),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = response.data;
      set({ currentUser: user, isAuthenticated: true, loadingUser: false });

      // Buscar nome do grupo
      if (user.id_grupo) {
        await get().setGroupName(user.id_grupo);
      }
      return user;
    } catch (error: any) {
      if (error.response?.status !== 401) {
        set({
          userError:
            error.response?.data?.message || "Erro ao carregar usuário",
        });
      }
      set({ loadingUser: false });
      return null;
    }
  },

  setGroupName: async (groupId: number) => {
    set({ loadingGroup: true });
    try {
      const group = await GroupService.getById(groupId);
      set({ groupName: group?.nome || null, loadingGroup: false });
    } catch {
      set({ groupName: null, loadingGroup: false });
    }
  },

  refreshAccessToken: async () => {
    const refresh =
      get().refreshToken || (getCookie(REFRESH_TOKEN_KEY) as string);
    if (!refresh) return false;

    try {
      const response = await axiosClient.post<{
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
      }>(API_ROUTES.authentication.refreshToken(), { refresh_token: refresh });

      const { access_token, refresh_token, expires_in } = response.data;
      get().setTokens(access_token, refresh_token || refresh, expires_in);
      return true;
    } catch {
      await get().logout();
      return false;
    }
  },

  logout: async () => {
    get().clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
