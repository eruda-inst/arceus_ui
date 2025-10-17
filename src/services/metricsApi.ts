const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
}

export const fetchTotalRequisicoes = () =>
  fetchFromApi<{ total_requisicoes: number }>("info/total_requisicoes");

export const fetchTempoMedioResposta = () =>
  fetchFromApi<{ tempo_medio_ms: number }>("info/tempo_medio_resposta");

export const fetchTaxaDeSucesso = () =>
  fetchFromApi<{ taxa_sucesso: number }>("info/taxa_sucesso");

export const fetchTaxaDeErro = () =>
  fetchFromApi<{ taxa_erro: number }>("info/taxa_erro");

export interface RecentRequest {
  ip: string;
  verb: string;
  endpoint: string;
  status: number;
  timestamp: string;
  duration: string;
}

export const fetchRecentRequests = () =>
  fetchFromApi<RecentRequest[]>("info/recent_requests");
