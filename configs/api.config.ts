const DEFAULT_BASE_API_URL = "http://localhost:8000";
const ENV_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
let BASE_API_URL = DEFAULT_BASE_API_URL;

if (ENV_BASE_API_URL) {
  if (ENV_BASE_API_URL?.endsWith("/")) {
    BASE_API_URL = ENV_BASE_API_URL.slice(0, -1);
  } else {
    BASE_API_URL = ENV_BASE_API_URL;
  }
}

const API_ENDPOINT_BASES = {
  authentication: `${BASE_API_URL}/api/v1/autenticacao`,
  group: `${BASE_API_URL}/api/v1/grupos`,
  perm: `${BASE_API_URL}/api/v1/permissoes`,
  ixc_user: `${BASE_API_URL}/api/v1/usuarios-ixc`,
  user: `${BASE_API_URL}/api/v1/usuarios`,
  log: `${BASE_API_URL}/api/v1/logs`,
  metric: `${BASE_API_URL}/api/v1/metricas`,
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
  log: {
    getAll: (
      filters: {
        page?: number;
        itemsPerPage?: number;
        method?: string;
        endpoint?: string;
        code?: number;
        data_inicio?: string;
        data_fim?: string;
        hora_inicio?: string;
        hora_fim?: string;
        protocol?: string;
        department?: string;
        nome_cliente?: string;
      } = {},
    ) => {
      const { page = 1, itemsPerPage = 10 } = filters;
      const params = new URLSearchParams();
      params.append("pagina", page.toString());
      params.append("itens_por_pagina", itemsPerPage.toString());
      if (filters.method) params.append("metodo", filters.method);
      if (filters.endpoint) params.append("endpoint", filters.endpoint);
      if (filters.code) params.append("codigo", String(filters.code));
      if (filters.data_inicio)
        params.append("data_inicio", filters.data_inicio);
      if (filters.data_fim) params.append("data_fim", filters.data_fim);
      if (filters.hora_inicio)
        params.append("hora_inicio", filters.hora_inicio);
      if (filters.hora_fim) params.append("hora_fim", filters.hora_fim);
      if (filters.protocol) params.append("protocolo", filters.protocol);
      if (filters.department) params.append("setor", filters.department);
      if (filters.nome_cliente)
        params.append("nome_cliente", filters.nome_cliente);
      return `${API_ENDPOINT_BASES.log}/?${params.toString()}`;
    },
  },
  metric: {
    totalReqs: () => `${API_ENDPOINT_BASES.metric}/total-requisicoes`,
    totalServices: () => `${API_ENDPOINT_BASES.metric}/total-atendimentos`,
    topEndpoints: () => `${API_ENDPOINT_BASES.metric}/top-endpoints`,
    topStatusCodes: () => `${API_ENDPOINT_BASES.metric}/top-status-codes`,
    topHours: () => `${API_ENDPOINT_BASES.metric}/top-horas`,
    topWeekdays: () => `${API_ENDPOINT_BASES.metric}/top-dias-semana`,
    topWorstEndpoints: () =>
      `${API_ENDPOINT_BASES.metric}/top-piores-endpoints`,
    topMonthDays: () => `${API_ENDPOINT_BASES.metric}/top-dias-mes`,
    topSlowestEndpoints: () =>
      `${API_ENDPOINT_BASES.metric}/top-endpoints-mais-lentos`,
    topHttpMethods: () => `${API_ENDPOINT_BASES.metric}/top-metodos-http`,
    topDepartments: () => `${API_ENDPOINT_BASES.metric}/top-setores`,
    sucessos: () => `${API_ENDPOINT_BASES.metric}/sucessos`,
    erros: () => `${API_ENDPOINT_BASES.metric}/erros`,
    resTime: () => `${API_ENDPOINT_BASES.metric}/tempo-resposta`,
    getTopClients: () => `${API_ENDPOINT_BASES.metric}/top-clientes`,
  },
};

export {
  DEFAULT_BASE_API_URL,
  ENV_BASE_API_URL,
  API_ENDPOINT_BASES,
  API_ROUTES,
};
