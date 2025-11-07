const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const API_CONFIG = {
  BASE_URL,
  HTTP_ENDPOINTS: {
    LOGIN: "/api/v1/auth/login",
    ME: "/api/v1/auth/me",
  },
  WS_ENDPOINTS: {
    TOTAL_REQUISICOES: "/api/v1/ws/info/total_requisicoes",
    TOTAL_REQUISICOES_HOJE: "/api/v1/ws/info/total_requisicoes_hoje",
    TEMPO_MEDIO_RESPOSTA: "/api/v1/ws/info/tempo_medio_resposta",
    TEMPO_MEDIO_RESPOSTA_HOJE: "/api/v1/ws/info/tempo_medio_resposta_hoje",
    TAXA_SUCESSO: "/api/v1/ws/info/taxa_sucesso",
    TAXA_SUCESSO_HOJE: "/api/v1/ws/info/taxa_sucesso_hoje",
    TAXA_ERRO: "/api/v1/ws/info/taxa_erro",
    TAXA_ERRO_HOJE: "/api/v1/ws/info/taxa_erro_hoje",
    REQUISICOES_POR_HORA: "/api/v1/ws/info/requisicoes_por_hora",
    DISTRIBUICAO_STATUS_CODE: "/api/v1/ws/info/distribuicao_status_code",
    TOP_ENDPOINTS: "/api/v1/ws/info/top_endpoints",
    REQUISICOES_RECENTES: "/api/v1/ws/info/requisicoes_recentes",
    REQUISICOES_RECENTES_ERRO: "/api/v1/ws/info/requisicoes_recentes_erro",
    LOGS: "/api/v1/ws/info/logs",
    DISTRIBUICAO_ACESSOS_HORA: "/api/v1/ws/info/distribuicao_acessos_hora",
    DISTRIBUICAO_ACESSOS_DIA_SEMANA:
      "/api/v1/ws/info/distribuicao_acessos_dia_semana",
    ENDPOINTS_COM_MAIS_ERROS: "/api/v1/ws/info/endpoints_com_mais_erros",
  },
};

export { API_CONFIG };
