const ENV_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const ENV_BASE_WS_API_URL = process.env.NEXT_PUBLIC_BASE_WS_API_URL;
let BASE_API_URL = "http://localhost:8000";
let BASE_WS_API_URL = "ws://localhost:8000";

if (ENV_BASE_API_URL) {
  if (ENV_BASE_API_URL?.endsWith("/")) {
    BASE_API_URL = ENV_BASE_API_URL.slice(0, -1);
  } else {
    BASE_API_URL = ENV_BASE_API_URL;
  }
}

if (ENV_BASE_WS_API_URL) {
  if (ENV_BASE_WS_API_URL?.endsWith("/")) {
    BASE_WS_API_URL = ENV_BASE_WS_API_URL.slice(0, -1);
  } else {
    BASE_WS_API_URL = ENV_BASE_WS_API_URL;
  }
}

const API_ENDPOINT_BASES = {
  authentication: `${BASE_API_URL}/api/v1/autenticacao`,
  group: `${BASE_API_URL}/api/v1/grupos`,
  perm: `${BASE_API_URL}/api/v1/permissoes`,
  ixc_user: `${BASE_API_URL}/api/v1/usuarios-ixc`,
  user: `${BASE_API_URL}/api/v1/usuarios`,
  log: `${BASE_WS_API_URL}/api/v1/logs/`, // Tem que terminar obrigatoriamente com "/"
  metric: `${BASE_WS_API_URL}/api/v1/metricas/`, // Tem que terminar obrigatoriamente com "/"
};

const API_ROUTES = {
  authentication: {
    login: () => `${API_ENDPOINT_BASES.authentication}/login`,
    refreshToken: () => `${API_ENDPOINT_BASES.authentication}/refresh-token`,
    getMe: () => `${API_ENDPOINT_BASES.authentication}/me`,
  },
  group: {
    getById: (id: number) => `${API_ENDPOINT_BASES.group}/id/${id}`,
    getAll: () => `${API_ENDPOINT_BASES.group}/`,
  },
  perm: {
    getByUserId: (id: number) => `${API_ENDPOINT_BASES.perm}/usuario/id/${id}`,
  },
  ixc_user: {
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
    getByEmail: (email: string) =>
      `${API_ENDPOINT_BASES.ixc_user}/email/${email}`,
  },
  user: {
    create: () => `${API_ENDPOINT_BASES.user}/`,
    updatePasswordById: (id: number) =>
      `${API_ENDPOINT_BASES.user}/mudar-senha/id/${id}`,
    updateById: (id: number) => `${API_ENDPOINT_BASES.user}/${id}`,
    toggleStatusById: (id: number) =>
      `${API_ENDPOINT_BASES.user}/${id}/alternar-status`,
    deleteById: (id: number) => `${API_ENDPOINT_BASES.user}/${id}`,
    getAll: (
      filters: {
        page?: number;
        itemsPerPage?: number;
        name?: string;
        email?: string;
        groupName?: string;
      } = {},
    ) => {
      const { page = 1, itemsPerPage = 10 } = filters;
      const params = new URLSearchParams();
      params.append("pagina", page.toString());
      params.append("itens_por_pagina", itemsPerPage.toString());
      if (filters.name) params.append("nome", filters.name);
      if (filters.email) params.append("email", filters.email);
      if (filters.groupName) params.append("nome_grupo", filters.groupName);
      return `${API_ENDPOINT_BASES.user}/?${params.toString()}`;
    },
  },
};

export { BASE_API_URL, BASE_WS_API_URL, API_ENDPOINT_BASES, API_ROUTES };
