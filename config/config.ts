const BASE_HTTP_URL =
  process.env.NEXT_PUBLIC_API_BASE_HTTP_URL || "http://localhost:8000";
const BASE_WS_URL =
  process.env.NEXT_PUBLIC_API_BASE_WS_URL || "ws://localhost:8000";

if (!BASE_HTTP_URL) {
  throw new Error("Informe NEXT_PUBLIC_API_BASE_HTTP_URL no .env para a API.");
}

if (!BASE_WS_URL) {
  throw new Error("Informe NEXT_PUBLIC_API_BASE_WS_URL no .env para a API.");
}

const HTTP_ENDPOINTS = {
  LOGIN: "api/v1/auth/login",
  ME: "api/v1/auth/me",
  REFRESH: "api/v1/auth/refresh",
  USUARIOS: "api/v1/usuarios/",
};

const WS_ENDPOINTS = {
  TOTAL_REQUISICOES: "api/v1/ws/info/total_requisicoes",
  TOTAL_REQUISICOES_HOJE: "api/v1/ws/info/total_requisicoes_hoje",
  TEMPO_MEDIO_RESPOSTA: "api/v1/ws/info/tempo_medio_resposta",
  TEMPO_MEDIO_RESPOSTA_HOJE: "api/v1/ws/info/tempo_medio_resposta_hoje",
  TAXA_SUCESSO: "api/v1/ws/info/taxa_sucesso",
  TAXA_SUCESSO_HOJE: "api/v1/ws/info/taxa_sucesso_hoje",
  TAXA_ERRO: "api/v1/ws/info/taxa_erro",
  TAXA_ERRO_HOJE: "api/v1/ws/info/taxa_erro_hoje",
  REQUISICOES_POR_HORA: "api/v1/ws/info/requisicoes_por_hora",
  DISTRIBUICAO_STATUS_CODES: "api/v1/ws/info/distribuicao_status_codes",
  TOP_ENDPOINTS: "api/v1/ws/info/top_endpoints",
  REQUISICOES_RECENTES: "api/v1/ws/info/requisicoes_recentes",
  REQUISICOES_RECENTES_ERRO: "api/v1/ws/info/requisicoes_recentes_erro",
  REGISTROS: "api/v1/ws/info/registros",
  DISTRIBUICAO_REQUISICOES_HORA: "api/v1/ws/info/distribuicao_requisicoes_hora",
  DISTRIBUICAO_REQUISICOES_DIA_SEMANA:
    "api/v1/ws/info/distribuicao_requisicoes_dia_semana",
  ENDPOINTS_COM_MAIS_ERROS: "api/v1/ws/info/endpoints_com_mais_erros",
  TOTAL_ATENDIMENTOS: "api/v1/ws/info/total_atendimentos",
  TOTAL_ATENDIMENTOS_HOJE: "api/v1/ws/info/total_atendimentos_hoje",
};

const API_CONFIG = {
  HTTP: {
    URL_BASE: BASE_HTTP_URL,
    ENDPOINTS: HTTP_ENDPOINTS,
    ROTAS: {
      LOGIN: `${BASE_HTTP_URL}/${HTTP_ENDPOINTS.LOGIN}`,
      ME: `${BASE_HTTP_URL}/${HTTP_ENDPOINTS.ME}`,
      REFRESH: `${BASE_HTTP_URL}/${HTTP_ENDPOINTS.REFRESH}`,
      USUARIOS: `${BASE_HTTP_URL}/${HTTP_ENDPOINTS.USUARIOS}`,
    },
  },
  WS: {
    URL_BASE: BASE_WS_URL,
    ENDPOINTS: WS_ENDPOINTS,
    ROTAS: {
      TOTAL_REQUISICOES: `${BASE_WS_URL}/${WS_ENDPOINTS.TOTAL_REQUISICOES}`,
      TOTAL_REQUISICOES_HOJE: `${BASE_WS_URL}/${WS_ENDPOINTS.TOTAL_REQUISICOES_HOJE}`,
      TEMPO_MEDIO_RESPOSTA: `${BASE_WS_URL}/${WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA}`,
      TEMPO_MEDIO_RESPOSTA_HOJE: `${BASE_WS_URL}/${WS_ENDPOINTS.TEMPO_MEDIO_RESPOSTA_HOJE}`,
      TAXA_SUCESSO: `${BASE_WS_URL}/${WS_ENDPOINTS.TAXA_SUCESSO}`,
      TAXA_SUCESSO_HOJE: `${BASE_WS_URL}/${WS_ENDPOINTS.TAXA_SUCESSO_HOJE}`,
      TAXA_ERRO: `${BASE_WS_URL}/${WS_ENDPOINTS.TAXA_ERRO}`,
      TAXA_ERRO_HOJE: `${BASE_WS_URL}/${WS_ENDPOINTS.TAXA_ERRO_HOJE}`,
      REQUISICOES_POR_HORA: `${BASE_WS_URL}/${WS_ENDPOINTS.REQUISICOES_POR_HORA}`,
      DISTRIBUICAO_STATUS_CODES: `${BASE_WS_URL}/${WS_ENDPOINTS.DISTRIBUICAO_STATUS_CODES}`,
      TOP_ENDPOINTS: `${BASE_WS_URL}/${WS_ENDPOINTS.TOP_ENDPOINTS}`,
      REQUISICOES_RECENTES: `${BASE_WS_URL}/${WS_ENDPOINTS.REQUISICOES_RECENTES}`,
      REQUISICOES_RECENTES_ERRO: `${BASE_WS_URL}/${WS_ENDPOINTS.REQUISICOES_RECENTES_ERRO}`,
      REGISTROS: `${BASE_WS_URL}/${WS_ENDPOINTS.REGISTROS}`,
      DISTRIBUICAO_REQUISICOES_HORA: `${BASE_WS_URL}/${WS_ENDPOINTS.DISTRIBUICAO_REQUISICOES_HORA}`,
      DISTRIBUICAO_REQUISICOES_DIA_SEMANA: `${BASE_WS_URL}/${WS_ENDPOINTS.DISTRIBUICAO_REQUISICOES_DIA_SEMANA}`,
      ENDPOINTS_COM_MAIS_ERROS: `${BASE_WS_URL}/${WS_ENDPOINTS.ENDPOINTS_COM_MAIS_ERROS}`,
      TOTAL_ATENDIMENTOS: `${BASE_WS_URL}/${WS_ENDPOINTS.TOTAL_ATENDIMENTOS}`,
      TOTAL_ATENDIMENTOS_HOJE: `${BASE_WS_URL}/${WS_ENDPOINTS.TOTAL_ATENDIMENTOS_HOJE}`,
    },
  },
};

export { API_CONFIG };
