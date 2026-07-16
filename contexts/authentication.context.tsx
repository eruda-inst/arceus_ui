import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  deleteCookie,
  getCookie,
  setCookie,
  OptionsType,
  hasCookie,
} from "cookies-next";
import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { UserOut } from "@/types/user.type";
import { GroupService } from "@/services/Group";

const ACCESS_TOKEN_KEY: string = "access_token";
const REFRESH_TOKEN_KEY: string = "refresh_token";
const TOKEN_EXPIRY_KEY: string = "token_expiry";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  refreshAccessToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  currentUser: UserOut | null;
  loadingUser: boolean;
  userError: string | null;
  groupName: string | null;
  loadingGroup: boolean;
  storeAccessToken: (token: string, expiresIn?: number) => void;
  storeRefreshToken: (token: string, expiresIn?: number) => void;
  storeTokens: (
    accessToken: string,
    refreshToken: string,
    accessExpiresIn?: number,
    refreshExpiresIn?: number,
  ) => void;
  clearAccessToken: () => void;
  clearRefreshToken: () => void;
  clearTokens: () => void;
  fetchCurrentUser: () => Promise<UserOut | null>;
  getCurrentUser: () => Promise<UserOut | null>;
  refreshUserData: () => Promise<UserOut | null>;
  getAuthHeader: () => Record<string, string>;
  checkTokenExpiry: () => boolean;
  getTimeUntilExpiry: () => number;
  hasAccessToken: () => boolean | Promise<boolean>;
  hasRefreshToken: () => boolean | Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getById: getGroupById } = GroupService;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserOut | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [loadingGroup, setLoadingGroup] = useState<boolean>(false);

  useEffect(() => {
    const storedAccessToken = getCookie(ACCESS_TOKEN_KEY) as string | undefined;
    const storedRefreshToken = getCookie(REFRESH_TOKEN_KEY) as
      | string
      | undefined;

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsAuthenticated(true);
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const fetchGroupName = useCallback(
    async (groupId: number) => {
      if (!groupId) {
        setGroupName(null);
        return;
      }
      setLoadingGroup(true);
      try {
        const group = await getGroupById(groupId);
        setGroupName(group?.nome || null);
      } catch {
        setGroupName(null);
      } finally {
        setLoadingGroup(false);
      }
    },
    [getGroupById],
  );

  useEffect(() => {
    if (currentUser?.id_grupo) {
      fetchGroupName(currentUser.id_grupo);
    } else {
      setGroupName(null);
    }
  }, [currentUser, fetchGroupName]);

  const logout = useCallback(async () => {
    try {
      setCurrentUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setGroupName(null);

      deleteCookie(ACCESS_TOKEN_KEY);
      deleteCookie(REFRESH_TOKEN_KEY);
      deleteCookie(TOKEN_EXPIRY_KEY);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch {}
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<UserOut | null> => {
    const token = accessToken || getCookie(ACCESS_TOKEN_KEY);

    if (!token) {
      return null;
    }

    setLoadingUser(true);
    setUserError(null);

    try {
      const response = await axiosClient.get<UserOut>(
        API_ROUTES.authentication.getMe(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCurrentUser(response.data);
      if (!isAuthenticated) setIsAuthenticated(true);
      if (!accessToken && typeof token === "string") setAccessToken(token);

      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 401) {
        setUserError(
          error.response?.data?.message || "Erro ao carregar usuário",
        );
      }
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, [accessToken, isAuthenticated]);

  const getCurrentUser = useCallback(async (): Promise<UserOut | null> => {
    return await fetchCurrentUser();
  }, [fetchCurrentUser]);

  const refreshUserData = useCallback(async (): Promise<UserOut | null> => {
    return await fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    const loadUserIfAuthenticated = async () => {
      if (isAuthenticated && accessToken && !currentUser && !loadingUser) {
        await fetchCurrentUser();
      }
    };
    loadUserIfAuthenticated();
  }, [
    isAuthenticated,
    accessToken,
    currentUser,
    fetchCurrentUser,
    loadingUser,
  ]);

  const storeAccessToken = useCallback((token: string, expiresIn?: number) => {
    const maxAge: number = expiresIn || 3600;
    const cookieOptions: OptionsType = {
      maxAge: maxAge,
      path: "/",
      sameSite: "lax",
      secure: false,
    };

    setCookie(ACCESS_TOKEN_KEY, token, cookieOptions);
    setAccessToken(token);
    setIsAuthenticated(true);

    const expiryDate: string = new Date(
      Date.now() + maxAge * 1000,
    ).toISOString();
    setCookie(TOKEN_EXPIRY_KEY, expiryDate, {
      ...cookieOptions,
      maxAge: maxAge,
    });
  }, []);

  const storeRefreshToken = useCallback((token: string, expiresIn?: number) => {
    const maxAge: number = expiresIn || 7 * 24 * 60 * 60;
    const cookieOptions: OptionsType = {
      maxAge: maxAge,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: false,
    };
    setCookie(REFRESH_TOKEN_KEY, token, cookieOptions);
    setRefreshToken(token);
  }, []);

  const storeTokens = useCallback(
    (
      accessToken: string,
      refreshToken: string,
      accessExpiresIn?: number,
      refreshExpiresIn?: number,
    ) => {
      storeAccessToken(accessToken, accessExpiresIn);
      storeRefreshToken(refreshToken, refreshExpiresIn);
    },
    [storeAccessToken, storeRefreshToken],
  );

  const clearAccessToken = useCallback(() => {
    deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
    deleteCookie(TOKEN_EXPIRY_KEY, { path: "/" });
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  const clearRefreshToken = useCallback(() => {
    deleteCookie(REFRESH_TOKEN_KEY, { path: "/" });
    setRefreshToken(null);
  }, []);

  const clearTokens = useCallback(() => {
    clearAccessToken();
    clearRefreshToken();
  }, [clearAccessToken, clearRefreshToken]);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const currentRefreshToken = refreshToken || getCookie(REFRESH_TOKEN_KEY);
    if (!currentRefreshToken) {
      return false;
    }
    try {
      const response = await axiosClient.post<{
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
      }>(API_ROUTES.authentication.refreshToken(), {
        refresh_token: currentRefreshToken,
      });
      const { access_token, refresh_token, expires_in } = response.data;
      storeAccessToken(access_token, expires_in);
      if (refresh_token) {
        storeRefreshToken(refresh_token);
      }
      return true;
    } catch {
      await logout();
      return false;
    }
  }, [refreshToken, storeAccessToken, storeRefreshToken, logout]);

  const getAuthHeader = useCallback((): Record<string, string> => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }, [accessToken]);

  const checkTokenExpiry = useCallback((): boolean => {
    const expiry = getCookie(TOKEN_EXPIRY_KEY) as string | undefined;
    if (!expiry) return false;
    const expiryDate = new Date(expiry);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000;
    return expiryDate.getTime() > now.getTime() + bufferTime;
  }, []);

  const hasAccessToken = useCallback(() => hasCookie(ACCESS_TOKEN_KEY), []);
  const hasRefreshToken = useCallback(() => hasCookie(REFRESH_TOKEN_KEY), []);

  const getTimeUntilExpiry = useCallback((): number => {
    const expiry = getCookie(TOKEN_EXPIRY_KEY) as string | undefined;
    if (!expiry) return 0;
    const expiryDate = new Date(expiry);
    const now = new Date();
    return expiryDate.getTime() - now.getTime();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        currentUser,
        loadingUser,
        userError,
        groupName,
        loadingGroup,
        storeAccessToken,
        refreshAccessToken,
        storeRefreshToken,
        storeTokens,
        clearAccessToken,
        clearRefreshToken,
        clearTokens,
        fetchCurrentUser,
        getCurrentUser,
        refreshUserData,
        getAuthHeader,
        checkTokenExpiry,
        getTimeUntilExpiry,
        hasAccessToken,
        hasRefreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
