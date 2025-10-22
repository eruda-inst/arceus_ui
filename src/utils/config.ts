const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const API_CONFIG = {
  BASE_URL,
  WS_ENDPOINTS: {
    TOTAL_REQUISICOES: "/api/v1/ws/info/total_requisicoes",
    TEMPO_MEDIO_RESPOSTA: "/api/v1/ws/info/tempo_medio_resposta",
    TAXA_SUCESSO: "/api/v1/ws/info/taxa_sucesso",
    TAXA_ERRO: "/api/v1/ws/info/taxa_erro",
    REQUISICOES_POR_HORA: "/api/v1/ws/info/requisicoes_por_hora",
    DISTRIBUICAO_STATUS_CODE: "/api/v1/ws/info/distribuicao_status_code",
    TOP_ENDPOINTS: "/api/v1/ws/info/top_endpoints",
    REQUISICOES_RECENTES: "/api/v1/ws/info/requisicoes_recentes",
    REQUISICOES_RECENTES_ERRO: "/api/v1/ws/info/requisicoes_recentes_erro",
  },
};

export { API_CONFIG };
