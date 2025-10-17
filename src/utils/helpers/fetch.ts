import { API_CONFIG } from "@/utils/config";

async function fetchDados(endpoint: string) {
  const URL = `${API_CONFIG.BASE_URL}${endpoint}`;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${URL}`);
  }
  const data = await res.json();

  return data;
}

export { fetchDados };
