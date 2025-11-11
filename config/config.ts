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
    DISTRIBUICAO_STATUS_CODES: "/api/v1/ws/info/distribuicao_status_codes",
    TOP_ENDPOINTS: "/api/v1/ws/info/top_endpoints",
    REQUISICOES_RECENTES: "/api/v1/ws/info/requisicoes_recentes",
    REQUISICOES_RECENTES_ERRO: "/api/v1/ws/info/requisicoes_recentes_erro",
    REGISTROS: "/api/v1/ws/info/registros",
    DISTRIBUICAO_REQUISICOES_HORA:
      "/api/v1/ws/info/distribuicao_requisicoes_hora",
    DISTRIBUICAO_REQUISICOES_DIA_SEMANA:
      "/api/v1/ws/info/distribuicao_requisicoes_dia_semana",
    ENDPOINTS_COM_MAIS_ERROS: "/api/v1/ws/info/endpoints_com_mais_erros",
    TOTAL_ATENDIMENTOS: "/api/v1/ws/info/total_atendimentos",
    TOTAL_ATENDIMENTOS_HOJE: "/api/v1/ws/info/total_atendimentos_hoje",
  },
};

export { API_CONFIG };
