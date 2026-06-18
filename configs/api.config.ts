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
    getByName: (name: string) => `${API_ENDPOINT_BASES.group}/nome/${name}`,
    getById: (id: number) => `${API_ENDPOINT_BASES.group}/id/${id}`,
    getAll: () => `${API_ENDPOINT_BASES.group}/`,
    getByUserId: (id: number) => `${API_ENDPOINT_BASES.group}/usuario/id/${id}`,
  },
  perm: {
    getById: (id: number) => `${API_ENDPOINT_BASES.perm}/id/${id}`,
    getByName: (name: string) => `${API_ENDPOINT_BASES.perm}/nome/${name}`,
    getByCode: (code: string) => `${API_ENDPOINT_BASES.perm}/codigo/${code}`,
    getByUserId: (id: number) => `${API_ENDPOINT_BASES.perm}/usuario/id/${id}`,
    getByGroupId: (id: number) => `${API_ENDPOINT_BASES.perm}/grupo/id/${id}`,
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
    inactivateById: (id: number) => `${API_ENDPOINT_BASES.user}/${id}/inativar`,
    reactivateById: (id: number) => `${API_ENDPOINT_BASES.user}/${id}/reativar`,
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
        ip?: string;
        method?: string;
        endpoint?: string;
        code?: string;
        data_inicio?: string;
        data_fim?: string;
        hora_inicio?: string;
        hora_fim?: string;
        duration?: number;
        protocol?: string;
        payload?: string;
        response?: string;
        url?: string;
        client?: string;
        domain?: string;
        department?: string;
      } = {},
    ) => {
      const { page = 1, itemsPerPage = 10 } = filters;
      const params = new URLSearchParams();
      params.append("pagina", page.toString());
      params.append("itens_por_pagina", itemsPerPage.toString());
      if (filters.ip) params.append("ip", filters.ip);
      if (filters.method) params.append("metodo", filters.method);
      if (filters.endpoint) params.append("endpoint", filters.endpoint);
      if (filters.code) params.append("codigo", filters.code);
      if (filters.data_inicio)
        params.append("data_inicio", filters.data_inicio);
      if (filters.data_fim) params.append("data_fim", filters.data_fim);
      if (filters.hora_inicio)
        params.append("hora_inicio", filters.hora_inicio);
      if (filters.hora_fim) params.append("hora_fim", filters.hora_fim);
      if (filters.duration)
        params.append("duracao", filters.duration.toString());
      if (filters.protocol) params.append("protocolo", filters.protocol);
      if (filters.payload) params.append("payload", filters.payload);
      if (filters.response) params.append("resposta", filters.response);
      if (filters.url) params.append("url", filters.url);
      if (filters.client) params.append("cliente", filters.client);
      if (filters.domain) params.append("dominio", filters.domain);
      if (filters.department) params.append("setor", filters.department);
      return `${API_ENDPOINT_BASES.log}/?${params.toString()}`;
    },
  },
  metric: {
    totalReqs: () => `${API_ENDPOINT_BASES.metric}/total-requisicoes`,
    avgResTime: () => `${API_ENDPOINT_BASES.metric}/tempo-medio-resposta`,
    successRate: () => `${API_ENDPOINT_BASES.metric}/taxa-sucesso`,
    errorRate: () => `${API_ENDPOINT_BASES.metric}/taxa-erro`,
    totalErrors: () => `${API_ENDPOINT_BASES.metric}/total-erros`,
    totalSuccesses: () => `${API_ENDPOINT_BASES.metric}/total-sucessos`,
    totalServices: () => `${API_ENDPOINT_BASES.metric}/total-atendimentos`,
    topEndpoints: () => `${API_ENDPOINT_BASES.metric}/top-endpoints`,
    topStatusCodes: () => `${API_ENDPOINT_BASES.metric}/top-status-codes`,
    topHours: () => `${API_ENDPOINT_BASES.metric}/top-horas`,
    topWeekdays: () => `${API_ENDPOINT_BASES.metric}/top-dias-semana`,
    topWorstEndpoints: () =>
      `${API_ENDPOINT_BASES.metric}/top-piores-endpoints`,
    topMonthDays: () => `${API_ENDPOINT_BASES.metric}/top-dias-mes`,
  },
};

export {
  DEFAULT_BASE_API_URL,
  ENV_BASE_API_URL,
  API_ENDPOINT_BASES,
  API_ROUTES,
};
