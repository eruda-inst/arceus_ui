export interface ApiConfig {
  HTTP: {
    URL_BASE: string;
    ENDPOINTS: Record<string, string>;
    ROTAS: Record<string, string>;
  };
  WS: {
    URL_BASE: string;
    ENDPOINTS: Record<string, string>;
    ROTAS: Record<string, string>;
  };
}

export const DEFAULT_HTTP_BASE_URL = "http://localhost:8000";
export const DEFAULT_WS_BASE_URL = "ws://localhost:8000";

export const enum HTTP_ENDPOINTS_NAME {
  LOGIN = "LOGIN",
  ME = "ME",
  REFRESH = "REFRESH",
  USUARIOS = "USUARIOS",
  USUARIOS_IXC = "USUARIOS_IXC",
  AGENTES = "AGENTES",
}

export const HTTP_ENDPOINTS = {
  [HTTP_ENDPOINTS_NAME.LOGIN]: "api/v1/autenticacao/login",
  [HTTP_ENDPOINTS_NAME.ME]: "api/v1/autenticacao/me",
  [HTTP_ENDPOINTS_NAME.REFRESH]: "api/v1/autenticacao/refresh",
  [HTTP_ENDPOINTS_NAME.USUARIOS]: "api/v1/usuarios/",
  [HTTP_ENDPOINTS_NAME.USUARIOS_IXC]: "api/v1/usuarios_ixc/",
  [HTTP_ENDPOINTS_NAME.AGENTES]: "api/v1/agentes/",
} as const;

export const enum WS_ENDPOINTS_NAME {
  TOTAL_REQUISICOES = "TOTAL_REQUISICOES",
  TOTAL_REQUISICOES_HOJE = "TOTAL_REQUISICOES_HOJE",
  TEMPO_MEDIO_RESPOSTA = "TEMPO_MEDIO_RESPOSTA",
  TEMPO_MEDIO_RESPOSTA_HOJE = "TEMPO_MEDIO_RESPOSTA_HOJE",
  TAXA_SUCESSO = "TAXA_SUCESSO",
  TAXA_SUCESSO_HOJE = "TAXA_SUCESSO_HOJE",
  TOTAL_SUCESSOS = "TOTAL_SUCESSOS",
  TOTAL_SUCESSOS_HOJE = "TOTAL_SUCESSOS_HOJE",
  TAXA_ERRO = "TAXA_ERRO",
  TAXA_ERRO_HOJE = "TAXA_ERRO_HOJE",
  TOTAL_ERROS = "TOTAL_ERROS",
  TOTAL_ERROS_HOJE = "TOTAL_ERROS_HOJE",
  REQUISICOES_POR_HORA = "REQUISICOES_POR_HORA",
  DISTRIBUICAO_STATUS_CODES = "DISTRIBUICAO_STATUS_CODES",
  TOP_ENDPOINTS = "TOP_ENDPOINTS",
  REQUISICOES_RECENTES = "REQUISICOES_RECENTES",
  REQUISICOES_RECENTES_ERRO = "REQUISICOES_RECENTES_ERRO",
  REGISTROS = "REGISTROS",
  DISTRIBUICAO_REQUISICOES_HORA = "DISTRIBUICAO_REQUISICOES_HORA",
  DISTRIBUICAO_REQUISICOES_DIA_SEMANA = "DISTRIBUICAO_REQUISICOES_DIA_SEMANA",
  ENDPOINTS_COM_MAIS_ERROS = "ENDPOINTS_COM_MAIS_ERROS",
  TOTAL_ATENDIMENTOS = "TOTAL_ATENDIMENTOS",
  TOTAL_ATENDIMENTOS_HOJE = "TOTAL_ATENDIMENTOS_HOJE",
}

export const WS_ENDPOINTS = {
  [WS_ENDPOINTS_NAME.TOTAL_REQUISICOES]: "api/v1/ws/metricas/total_requisicoes",
  [WS_ENDPOINTS_NAME.TOTAL_REQUISICOES_HOJE]:
    "api/v1/ws/metricas/total_requisicoes_hoje",
  [WS_ENDPOINTS_NAME.TEMPO_MEDIO_RESPOSTA]:
    "api/v1/ws/metricas/tempo_medio_resposta",
  [WS_ENDPOINTS_NAME.TEMPO_MEDIO_RESPOSTA_HOJE]:
    "api/v1/ws/metricas/tempo_medio_resposta_hoje",
  [WS_ENDPOINTS_NAME.TAXA_SUCESSO]: "api/v1/ws/metricas/taxa_sucesso",
  [WS_ENDPOINTS_NAME.TAXA_SUCESSO_HOJE]: "api/v1/ws/metricas/taxa_sucesso_hoje",
  [WS_ENDPOINTS_NAME.TOTAL_SUCESSOS]: "api/v1/ws/metricas/total_sucessos",
  [WS_ENDPOINTS_NAME.TOTAL_SUCESSOS_HOJE]:
    "api/v1/ws/metricas/total_sucessos_hoje",
  [WS_ENDPOINTS_NAME.TAXA_ERRO]: "api/v1/ws/metricas/taxa_erro",
  [WS_ENDPOINTS_NAME.TAXA_ERRO_HOJE]: "api/v1/ws/metricas/taxa_erro_hoje",
  [WS_ENDPOINTS_NAME.TOTAL_ERROS]: "api/v1/ws/metricas/total_erros",
  [WS_ENDPOINTS_NAME.TOTAL_ERROS_HOJE]: "api/v1/ws/metricas/total_erros_hoje",
  [WS_ENDPOINTS_NAME.REQUISICOES_POR_HORA]:
    "api/v1/ws/metricas/requisicoes_por_hora",
  [WS_ENDPOINTS_NAME.DISTRIBUICAO_STATUS_CODES]:
    "api/v1/ws/metricas/distribuicao_status_codes",
  [WS_ENDPOINTS_NAME.TOP_ENDPOINTS]: "api/v1/ws/metricas/top_endpoints",
  [WS_ENDPOINTS_NAME.REQUISICOES_RECENTES]:
    "api/v1/ws/metricas/requisicoes_recentes",
  [WS_ENDPOINTS_NAME.REQUISICOES_RECENTES_ERRO]:
    "api/v1/ws/metricas/requisicoes_recentes_erro",
  [WS_ENDPOINTS_NAME.REGISTROS]: "api/v1/ws/metricas/registros",
  [WS_ENDPOINTS_NAME.DISTRIBUICAO_REQUISICOES_HORA]:
    "api/v1/ws/metricas/distribuicao_requisicoes_hora",
  [WS_ENDPOINTS_NAME.DISTRIBUICAO_REQUISICOES_DIA_SEMANA]:
    "api/v1/ws/metricas/distribuicao_requisicoes_dia_semana",
  [WS_ENDPOINTS_NAME.ENDPOINTS_COM_MAIS_ERROS]:
    "api/v1/ws/metricas/endpoints_com_mais_erros",
  [WS_ENDPOINTS_NAME.TOTAL_ATENDIMENTOS]:
    "api/v1/ws/metricas/total_atendimentos",
  [WS_ENDPOINTS_NAME.TOTAL_ATENDIMENTOS_HOJE]:
    "api/v1/ws/metricas/total_atendimentos_hoje",
} as const;

const createCompleteUrls = (
  baseUrl: string,
  endpoints: Record<string, string>
): Record<string, string> => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return Object.fromEntries(
    Object.entries(endpoints).map(([key, endpoint]) => [
      key,
      `${normalizedBaseUrl}/${endpoint.replace(/^\//, "")}`,
    ])
  );
};

const validateEnvironmentVariables = () => {
  if (!process.env.NEXT_PUBLIC_BASE_HTTP_URL) {
    console.warn(
      `NEXT_PUBLIC_BASE_HTTP_URL não foi definido, usando valor padrão: ${DEFAULT_HTTP_BASE_URL}`
    );
  }

  if (!process.env.NEXT_PUBLIC_BASE_WS_URL) {
    console.warn(
      `NEXT_PUBLIC_BASE_WS_URL não foi definido, usando valor padrão: ${DEFAULT_WS_BASE_URL}`
    );
  }
};

validateEnvironmentVariables();

export const BASE_HTTP_URL =
  process.env.NEXT_PUBLIC_BASE_HTTP_URL || DEFAULT_HTTP_BASE_URL;
export const BASE_WS_URL =
  process.env.NEXT_PUBLIC_BASE_WS_URL || DEFAULT_WS_BASE_URL;

export const API_CONFIG: ApiConfig = {
  HTTP: {
    URL_BASE: BASE_HTTP_URL,
    ENDPOINTS: HTTP_ENDPOINTS,
    ROTAS: createCompleteUrls(BASE_HTTP_URL, HTTP_ENDPOINTS),
  },
  WS: {
    URL_BASE: BASE_WS_URL,
    ENDPOINTS: WS_ENDPOINTS,
    ROTAS: createCompleteUrls(BASE_WS_URL, WS_ENDPOINTS),
  },
};

export const getHttpUrl = (endpoint: HTTP_ENDPOINTS_NAME): string => {
  return API_CONFIG.HTTP.ROTAS[endpoint];
};

export const getWsUrl = (endpoint: WS_ENDPOINTS_NAME): string => {
  const url = API_CONFIG.WS.ROTAS[endpoint];

  // If running in the browser, try to attach the access token from cookies
  // so the backend can authenticate the websocket connection via query param.
  // We avoid importing cookie helpers here to keep the module safe for server
  // side usage — only access `document` when available.
  if (typeof window !== "undefined") {
    try {
      const cookieEntry = document.cookie
        .split("; ")
        .find((c) => c.startsWith("auth-token="));

      if (cookieEntry) {
        const token = decodeURIComponent(cookieEntry.split("=")[1] || "");
        if (token) {
          const sep = url.includes("?") ? "&" : "?";
          return `${url}${sep}token=${encodeURIComponent(token)}`;
        }
      }
    } catch (err) {
      // silent fallback to plain URL on any error
      console.warn("Failed to attach token to WS URL:", err);
    }
  }

  return url;
};

export type HttpEndpoint = keyof typeof HTTP_ENDPOINTS;
export type WsEndpoint = keyof typeof WS_ENDPOINTS;
