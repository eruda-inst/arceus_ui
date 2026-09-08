// Base URLs from environment variables
let BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
let BASE_WS_API_URL = process.env.NEXT_PUBLIC_BASE_WS_API_URL;

// Ensure base URLs do not have trailing slashes for consistent path concatenation
if (BASE_API_URL?.endsWith("/")) {
  BASE_API_URL = BASE_API_URL.slice(0, -1);
}

if (BASE_WS_API_URL?.endsWith("/")) {
  BASE_WS_API_URL = BASE_WS_API_URL.slice(0, -1);
}

/**
 * Grouped base endpoints for different API modules.
 * Each key represents a service domain.
 */
const API_ENDPOINT_BASES = {
  auth: `${BASE_API_URL}/api/v1/autenticacao`,
  group: `${BASE_API_URL}/api/v1/grupos`,
  perm: `${BASE_API_URL}/api/v1/permissoes`,
  ixc_user: `${BASE_API_URL}/api/v1/usuarios-ixc`,
  user: `${BASE_API_URL}/api/v1/usuarios`,

  // WebSocket-related endpoints (separate base)
  logWs: `${BASE_WS_API_URL}/api/v1/logs-ws`,
  metricWs: `${BASE_WS_API_URL}/api/v1/metricas-ws`,
  userWs: `${BASE_WS_API_URL}/api/v1/usuarios-ws`,
};

/**
 * Complete route definitions for each API resource.
 * Functions return fully qualified URLs with query parameters when needed.
 */
const API_ROUTES = {
  auth: {
    /** POST login endpoint */
    login: () => `${API_ENDPOINT_BASES.auth}/login`,
    /** POST refresh token endpoint */
    refreshToken: () => `${API_ENDPOINT_BASES.auth}/refresh-token`,
    /** GET current user profile */
    getMe: () => `${API_ENDPOINT_BASES.auth}/me`,
  },
  group: {
    /** GET group by ID */
    getById: (id: number) => `${API_ENDPOINT_BASES.group}/id/${id}`,
    /** GET all groups (paginated) */
    getAll: () => `${API_ENDPOINT_BASES.group}/`,
  },
  perm: {
    /** GET permissions by user ID */
    getByUserId: (id: number) => `${API_ENDPOINT_BASES.perm}/usuario/id/${id}`,
  },
  ixc_user: {
    /**
     * GET external users (IXC) with pagination and optional filters.
     * @param filters - Optional pagination and search parameters
     */
    getAll: (
      filters: {
        page?: number;
        itemsPerPage?: number;
        name?: string;
        email?: string;
      } = {},
    ) => {
      const { page = 1, itemsPerPage = 10 } = filters;
      const params = new URLSearchParams();
      params.append("pagina", page.toString());
      params.append("itens_por_pagina", itemsPerPage.toString());
      if (filters.name) params.append("nome", filters.name);
      if (filters.email) params.append("email", filters.email);
      return `${API_ENDPOINT_BASES.ixc_user}/?${params.toString()}`;
    },
    /** GET external user by email */
    getByEmail: (email: string) =>
      `${API_ENDPOINT_BASES.ixc_user}/email/${email}`,
  },
  user: {
    /** POST create a new internal user */
    create: () => `${API_ENDPOINT_BASES.user}/`,
    /** PATCH update password for user by ID */
    updatePasswordById: (id: number) =>
      `${API_ENDPOINT_BASES.user}/mudar-senha/id/${id}`,
    /** PATCH toggle user active status */
    toggleStatusById: (id: number) =>
      `${API_ENDPOINT_BASES.user}/${id}/alternar-status`,
    /** DELETE user by ID */
    deleteById: (id: number) => `${API_ENDPOINT_BASES.user}/${id}`,
  },

  // WebSocket-related routes (used for real-time data)
  logWs: () => `${API_ENDPOINT_BASES.logWs}/`,
  metricWs: () => `${API_ENDPOINT_BASES.metricWs}/`,
  userWs: () => `${API_ENDPOINT_BASES.userWs}/`,
};

export { API_ROUTES };
