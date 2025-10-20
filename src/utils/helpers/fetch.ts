import { API_CONFIG } from "@/utils/config";

async function fetchDados(
  endpoint: string,
  queryParams?: Record<string, string | number>,
) {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${url.toString()}`);
  }
  const data = await res.json();

  return data;
}

export { fetchDados };
