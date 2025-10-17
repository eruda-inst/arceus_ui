const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    TOTAL_REQUISICOES: "/api/v1/info/total_requisicoes",
    TEMPO_MEDIO_RESPOSTA: "/api/v1/info/tempo_medio_resposta",
    TAXA_SUCESSO: "/api/v1/info/taxa_sucesso",
    TAXA_ERRO: "/api/v1/info/taxa_erro",
    REQUISICOES_POR_HORA: "/api/v1/info/requisicoes_por_hora",
    DISTRIBUICAO_STATUS_CODE: "/api/v1/info/distribuicao_status_code",
    TOP_ENDPOINTS: "/api/v1/info/top_endpoints",
    REQUISICOES_RECENTES: "/api/v1/info/requisicoes_recentes",
    REQUISICOES_RECENTES_ERRO: "/api/v1/info/requisicoes_recentes_erro",
  },
};

export { API_CONFIG };
